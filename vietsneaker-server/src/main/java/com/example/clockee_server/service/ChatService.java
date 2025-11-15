package com.example.clockee_server.service;

import com.example.clockee_server.entity.Product;
import com.example.clockee_server.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import org.springframework.beans.factory.annotation.Value;
import jakarta.annotation.PostConstruct;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.Comparator;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ProductRepository productRepository;

    private static final String SHOP_BASE_URL =
            Optional.ofNullable(System.getenv("SHOP_BASE_URL"))
                    .orElse("http://localhost:3000");

    @Value("${openai.api.key}")
    private String apiKey;

    private WebClient openai;

    @PostConstruct
    public void init() {
        this.openai = WebClient.builder()
                .baseUrl("https://api.openai.com/v1")
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build();
    }

    public String processMessage(String message) {
        final String msg = message == null ? "" : message.trim();

        // 1) Intent: lọc sản phẩm theo giá (dưới / trên / bằng / khoảng)
        PriceFilter priceFilter = tryParsePriceFilter(msg);
        if (priceFilter != null && priceFilter.amountVnd() != null) {

            Double value = priceFilter.amountVnd().doubleValue();
            List<Product> products = new ArrayList<>();
            String label;

            switch (priceFilter.operator()) {
                case LESS -> {
                    // Sản phẩm DƯỚI giá
                    products = productRepository.findBySellPriceLessThan(value);
                    label = "dưới ";
                }
                case GREATER -> {
                    // Sản phẩm TRÊN giá
                    products = productRepository.findBySellPriceGreaterThan(value);
                    label = "trên ";
                }
                case EQUAL -> {
                    // Sản phẩm BẰNG / KHOẢNG giá
                    // - "bằng"      → ±5%
                    // - "khoảng"…   → ±20%
                    double percent = priceFilter.wideRange() ? 0.20 : 0.05;
                    double delta = value * percent;
                    products = productRepository.findBySellPriceBetween(value - delta, value + delta);
                    label = "khoảng ";
                }
                default -> {
                    // fallback: coi như "dưới"
                    products = productRepository.findBySellPriceLessThan(value);
                    label = "dưới ";
                }
            }

            if (products == null || products.isEmpty()) {
                return "Không có sản phẩm nào " + label + formatPriceHuman(priceFilter.amountVnd()) + " 😢";
            }

            // Sắp xếp theo giá tăng dần
            List<Product> top =
                    products.stream()
                            .sorted(Comparator.comparingDouble(p ->
                                    Optional.ofNullable(p.getSellPrice()).orElse(Double.MAX_VALUE)))
                            .limit(6)
                            .collect(Collectors.toList());

            StringBuilder sb = new StringBuilder();
            sb.append("Mình gợi ý ")
              .append(top.size())
              .append(" sản phẩm ")
              .append(label)
              .append(formatPriceHuman(priceFilter.amountVnd()))
              .append(":\n");

            for (Product p : top) {
                Long pid = p.getProductId();
                if (pid != null) {
                    sb.append("- ")
                      .append(SHOP_BASE_URL)
                      .append("/product/")
                      .append(pid)
                      .append("\n");
                }
            }

            return sb.toString().trim();
        }

        // 2) Câu hỏi khác → gọi OpenAI Chat Completions (REST)
        OpenAIChatRequest req = new OpenAIChatRequest();
        req.setModel("gpt-4o-mini");
        req.setMax_tokens(300);

        List<OpenAIChatRequest.Message> msgs = new ArrayList<>();
        msgs.add(new OpenAIChatRequest.Message(
                "system",
                "Bạn là trợ lý tư vấn bán hàng cho VietSneaker. Trả lời ngắn gọn, thân thiện, tiếng Việt."));
        msgs.add(new OpenAIChatRequest.Message("user", msg));
        req.setMessages(msgs);

        OpenAIChatResponse resp = openai.post()
                .uri("/chat/completions")
                .bodyValue(req)
                .retrieve()
                .bodyToMono(OpenAIChatResponse.class)
                .onErrorResume(e -> {
                    OpenAIChatResponse fallback = new OpenAIChatResponse();
                    OpenAIChatResponse.Message m = new OpenAIChatResponse.Message();
                    m.setRole("assistant");
                    m.setContent("Xin lỗi, hệ thống đang bận. Bạn thử lại chút nhé!");
                    OpenAIChatResponse.Choice c = new OpenAIChatResponse.Choice();
                    c.setMessage(m);
                    List<OpenAIChatResponse.Choice> list = new ArrayList<>();
                    list.add(c);
                    fallback.setChoices(list);
                    return Mono.just(fallback);
                })
                .block();

        return Optional.ofNullable(resp)
                .map(OpenAIChatResponse::getChoices)
                .filter(list -> !list.isEmpty())
                .map(list -> list.get(0))
                .map(OpenAIChatResponse.Choice::getMessage)
                .map(OpenAIChatResponse.Message::getContent)
                .orElse("Xin lỗi, mình chưa có câu trả lời phù hợp.");
    }

    // ================== PARSE GIÁ + TOÁN TỬ ==================

    private PriceFilter tryParsePriceFilter(String text) {
        if (text == null || text.isBlank()) return null;

        String lower = text.toLowerCase(Locale.ROOT);

        // Lấy số tiền (VND) trước
        Long amount = extractAmountVnd(lower);
        if (amount == null) return null;

        // Chuỗi để bắt từ khóa so sánh
        String normalizedOps = lower
                .replace(".", "")
                .replace(",", "")
                .trim();

        boolean hasLess = normalizedOps.contains("dưới")
                || normalizedOps.contains("nhỏ hơn")
                || normalizedOps.contains("<");

        boolean hasGreater = normalizedOps.contains("trên")
                || normalizedOps.contains("lớn hơn")
                || normalizedOps.contains("cao hơn")
                || normalizedOps.contains(">")
                || normalizedOps.contains("từ ");

        // "khoảng", "tầm", "xấp xỉ" → wide range (±20%)
        boolean hasApproxWord = normalizedOps.contains("khoảng")
                || normalizedOps.contains("tầm")
                || normalizedOps.contains("xap xi")
                || normalizedOps.contains("xấp xỉ");

        boolean hasEqual = normalizedOps.contains("bằng")
                || normalizedOps.contains("đúng")
                || normalizedOps.contains("= ")
                || hasApproxWord;

        PriceFilter.Operator op;
        if (hasLess) {
            op = PriceFilter.Operator.LESS;
        } else if (hasGreater) {
            op = PriceFilter.Operator.GREATER;
        } else if (hasEqual) {
            op = PriceFilter.Operator.EQUAL;
        } else {
            // Không nói rõ → mặc định hiểu là "dưới"
            op = PriceFilter.Operator.LESS;
        }

        // wideRange = true nếu có "khoảng"/"tầm"/"xấp xỉ"
        return new PriceFilter(op, amount, hasApproxWord);
    }

    /**
     * Parse các kiểu:
     *  - "3 triệu"        → 3_000_000
     *  - "3,5 triệu"      → 3_500_000
     *  - "3,4tr"          → 3_400_000
     *  - "3 triệu 5"      → 3_500_000
     *  - "3500000"        → 3_500_000
     */
    private Long extractAmountVnd(String text) {
        if (text == null || text.isBlank()) return null;

        String lower = text.toLowerCase(Locale.ROOT).trim();
        // Để parse thập phân, chuyển ',' thành '.'
        String decimalFriendly = lower.replace(",", ".");

        // CASE 1: "3 triệu 5", "3 triệu 50", "3 triệu 500"
        Pattern pMillionAnd = Pattern.compile("(\\d+)\\s*triệu\\s+(\\d+)");
        Matcher m2 = pMillionAnd.matcher(decimalFriendly);
        if (m2.find()) {
            long millionPart = Long.parseLong(m2.group(1));
            long tail = Long.parseLong(m2.group(2));

            double decimalPart;
            if (tail < 10) {
                // "3 triệu 5" → 3.5
                decimalPart = tail / 10.0;
            } else if (tail < 100) {
                // "3 triệu 25" → 3.25 (ít gặp)
                decimalPart = tail / 100.0;
            } else {
                // "3 triệu 500" → 3.5
                decimalPart = tail / 1000.0;
            }

            long vnd = Math.round((millionPart + decimalPart) * 1_000_000L);
            return vnd;
        }

        // CASE 2: "3 triệu", "3.5 triệu", "3,4 triệu", "3.5tr", "3,4tr"
        Pattern pMillion = Pattern.compile("(\\d+(?:\\.\\d+)?)\\s*(triệu|tr)");
        Matcher m = pMillion.matcher(decimalFriendly);
        if (m.find()) {
            double valueMillion = Double.parseDouble(m.group(1)); // ví dụ 3.5
            long vnd = Math.round(valueMillion * 1_000_000L);
            return vnd;
        }

        // CASE 3: nhập trực tiếp số VND: 3000000, 3500000...
        String digitsOnly = lower.replaceAll("[^0-9]", " ");
        String[] tokens = digitsOnly.trim().split("\\s+");
        Long any = null;
        for (String t : tokens) {
            if (t.matches("\\d+")) {
                try {
                    any = Long.parseLong(t);
                } catch (NumberFormatException ignored) {}
            }
        }
        return any;
    }

    private String formatPriceHuman(Long vnd) {
        if (vnd == null) return "";
        // Nếu ≥ 1 triệu thì ưu tiên hiển thị "x triệu" / "x,5 triệu"
        if (vnd >= 1_000_000L) {
            double millions = vnd / 1_000_000.0;
            long rounded = Math.round(millions);

            // đúng số nguyên: 3.0 → "3 triệu"
            if (Math.abs(millions - rounded) < 1e-6) {
                return rounded + " triệu";
            }

            // nếu có 1 chữ số thập phân (3.5, 3.4,...) → "3,5 triệu"
            double tenTimes = millions * 10;
            long tenRounded = Math.round(tenTimes);
            if (Math.abs(tenTimes - tenRounded) < 1e-6) {
                String s = String.valueOf(tenRounded / 10.0); // "3.5"
                s = s.replace('.', ','); // "3,5"
                return s + " triệu";
            }
        }

        // fallback: hiển thị dạng tiền Việt 3.500.000đ
        return String.format("%,dđ", vnd);
    }

    // ===== DTO đơn giản cho OpenAI =====
    public static class OpenAIChatRequest {
        private String model;
        private List<Message> messages;
        private Integer max_tokens;

        public static class Message {
            private String role;
            private String content;
            public Message() {}
            public Message(String role, String content) { this.role = role; this.content = content; }
            public String getRole() { return role; }
            public void setRole(String role) { this.role = role; }
            public String getContent() { return content; }
            public void setContent(String content) { this.content = content; }
        }

        public String getModel() { return model; }
        public void setModel(String model) { this.model = model; }
        public List<Message> getMessages() { return messages; }
        public void setMessages(List<Message> messages) { this.messages = messages; }
        public Integer getMax_tokens() { return max_tokens; }
        public void setMax_tokens(Integer max_tokens) { this.max_tokens = max_tokens; }
    }

    public static class OpenAIChatResponse {
        private List<Choice> choices;
        public static class Choice {
            private Message message;
            public Message getMessage() { return message; }
            public void setMessage(Message message) { this.message = message; }
        }
        public static class Message {
            private String role;
            private String content;
            public String getRole() { return role; }
            public void setRole(String role) { this.role = role; }
            public String getContent() { return content; }
            public void setContent(String content) { this.content = content; }
        }
        public List<Choice> getChoices() { return choices; }
        public void setChoices(List<Choice> choices) { this.choices = choices; }
    }

    // ====== RECORD GIỮ TOÁN TỬ GIÁ ======
    private record PriceFilter(Operator operator, Long amountVnd, boolean wideRange) {
        enum Operator { LESS, GREATER, EQUAL }
    }
}
