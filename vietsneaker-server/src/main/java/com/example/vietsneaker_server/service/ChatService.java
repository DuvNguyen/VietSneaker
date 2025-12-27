package com.example.vietsneaker_server.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import reactor.netty.http.client.HttpClient;

import jakarta.annotation.PostConstruct;

import com.example.vietsneaker_server.entity.Product;
import com.example.vietsneaker_server.repository.ProductRepository;

import java.time.Duration;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import java.util.Comparator;

@Service
@RequiredArgsConstructor
@Log4j2
public class ChatService {

    private final ProductRepository productRepository;

    // Trả về HTTP link; có thể override bằng env SHOP_BASE_URL
    private static final String SHOP_BASE_URL =
            Optional.ofNullable(System.getenv("SHOP_BASE_URL"))
                    .orElse("http://localhost:3000");

    @Value("${openai.api.key:}")
    private String apiKey;

    @Value("${openai.api.url:https://api.openai.com/v1}")
    private String apiUrl;

    private WebClient openai;

    @PostConstruct
    public void init() {
        System.out.println(">>> OPENAI KEY LOADED = [" + apiKey + "]");
        // Tạo WebClient với timeout; nếu không có key thì vẫn khởi tạo để có log đẹp
        HttpClient httpClient = HttpClient.create()
                .responseTimeout(Duration.ofSeconds(20));

        this.openai = WebClient.builder()
                .baseUrl(apiUrl)
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                .defaultHeader("HTTP-Referer", "https://viet-sneaker.com")
                .defaultHeader("X-Title", "VietSneaker Chatbot")
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .build();

        if (apiKey == null || apiKey.isBlank()) {
            System.err.println("[OpenAI] WARNING: 'openai.api.key' is empty -> AI answers will be skipped.");
        }
    }

    public String processMessage(String message) {
        final String msg = message == null ? "" : message.trim();
        log.info("ChatService processing message: {}", msg);

        // 1) Nhận dạng ý định lọc theo giá (dưới/trên/bằng/khoảng)
        PriceFilter priceFilter = tryParsePriceFilter(msg);
        if (priceFilter != null && priceFilter.amountVnd() != null) {
            Double value = priceFilter.amountVnd().doubleValue();
            List<Product> products;
            String label;

            switch (priceFilter.operator()) {
                case LESS -> {
                    products = productRepository.findBySellPriceLessThan(value);
                    label = "dưới ";
                }
                case GREATER -> {
                    products = productRepository.findBySellPriceGreaterThan(value);
                    label = "trên ";
                }
                case EQUAL -> {
                    double percent = priceFilter.wideRange() ? 0.20 : 0.05; // khoảng → ±20%, bằng → ±5%
                    double delta = value * percent;
                    products = productRepository.findBySellPriceBetween(value - delta, value + delta);
                    label = "khoảng ";
                }
                default -> {
                    products = productRepository.findBySellPriceLessThan(value);
                    label = "dưới ";
                }
            }

            if (products == null || products.isEmpty()) {
                return "Không có sản phẩm nào " + label + formatPriceHuman(priceFilter.amountVnd()) + " 😢";
            }

            // Sắp theo giá tăng dần, lấy tối đa 6
            List<Product> top = products.stream()
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
                    sb.append("- ").append(SHOP_BASE_URL).append("/product/").append(pid).append("\n");
                }
            }
            return sb.toString().trim();
        }

        // 2) Câu hỏi khác → gọi OpenAI (nếu có key)
        return askOpenAI(msg);
    }

    /* ================== OPENAI ================== */

    private String askOpenAI(String userMsg) {
        if (apiKey == null || apiKey.isBlank()) {
            return "Xin chào! Hiện mình chỉ hỗ trợ gợi ý sản phẩm theo giá. Bạn thử hỏi “dưới 3 triệu”, “khoảng 3,5 triệu”… nhé 😊";
        }

        OpenAIChatRequest req = new OpenAIChatRequest();
        req.setModel("deepseek/deepseek-chat"); // đổi model nếu tài khoản không có quyền
        req.setMax_tokens(300);

        List<OpenAIChatRequest.Message> msgs = new ArrayList<>();
        msgs.add(new OpenAIChatRequest.Message("system",
                "Bạn là trợ lý tư vấn bán hàng cho VietSneaker. Trả lời ngắn gọn, thân thiện, tiếng Việt."));
        msgs.add(new OpenAIChatRequest.Message("user", userMsg));
        req.setMessages(msgs);

        try {
            OpenAIChatResponse resp = openai.post()
                    .uri("/chat/completions")
                    .bodyValue(req)
                    .retrieve()
                    .onStatus(s -> !s.is2xxSuccessful(), r ->
                            r.bodyToMono(String.class).flatMap(body ->
                                    Mono.error(new RuntimeException("OpenAI HTTP " + r.statusCode().value() + ": " + body))
                            )
                    )
                    .bodyToMono(OpenAIChatResponse.class)
                    .block();

            return Optional.ofNullable(resp)
                    .map(OpenAIChatResponse::getChoices)
                    .filter(list -> !list.isEmpty())
                    .map(list -> list.get(0))
                    .map(OpenAIChatResponse.Choice::getMessage)
                    .map(OpenAIChatResponse.Message::getContent)
                    .orElse("Mình chưa có câu trả lời phù hợp.");

        } catch (Exception ex) {
            System.err.println("[OpenAI] call failed: " + ex.getMessage());
            return "Xin lỗi, mình đang không kết nối được AI. Bạn có thể hỏi theo dạng “dưới 3 triệu”, “khoảng 3,5 triệu”… nhé!";
        }
    }

    /* ================== PARSE GIÁ + TOÁN TỬ ================== */

    private PriceFilter tryParsePriceFilter(String text) {
        if (text == null || text.isBlank()) return null;
        String lower = text.toLowerCase(Locale.ROOT);

        Long amount = extractAmountVnd(lower);
        if (amount == null) return null;

        String normalizedOps = lower.replace(".", "").replace(",", "").trim();

        boolean hasLess = normalizedOps.contains("dưới")
                || normalizedOps.contains("nhỏ hơn")
                || normalizedOps.contains("<");

        boolean hasGreater = normalizedOps.contains("trên")
                || normalizedOps.contains("lớn hơn")
                || normalizedOps.contains("cao hơn")
                || normalizedOps.contains(">")
                || normalizedOps.contains("từ ");

        boolean hasApproxWord = normalizedOps.contains("khoảng")
                || normalizedOps.contains("tầm")
                || normalizedOps.contains("xap xi")
                || normalizedOps.contains("xấp xỉ");

        boolean hasEqual = normalizedOps.contains("bằng")
                || normalizedOps.contains("đúng")
                || normalizedOps.contains("= ")
                || hasApproxWord;

        PriceFilter.Operator op;
        if (hasLess) op = PriceFilter.Operator.LESS;
        else if (hasGreater) op = PriceFilter.Operator.GREATER;
        else if (hasEqual) op = PriceFilter.Operator.EQUAL;
        else op = PriceFilter.Operator.LESS;

        return new PriceFilter(op, amount, hasApproxWord);
    }

    /**
     * Parse số tiền:
     *  - "3 triệu", "3,5 triệu", "3.5tr"
     *  - "3 triệu 5" (→ 3,5 triệu)
     *  - "3500000"
     */
    private Long extractAmountVnd(String text) {
        if (text == null || text.isBlank()) return null;

        String lower = text.toLowerCase(Locale.ROOT).trim();
        String decimalFriendly = lower.replace(",", ".");

        // "3 triệu 5", "3 triệu 500"
        Pattern pMillionAnd = Pattern.compile("(\\d+)\\s*triệu\\s+(\\d+)");
        Matcher m2 = pMillionAnd.matcher(decimalFriendly);
        if (m2.find()) {
            long millionPart = Long.parseLong(m2.group(1));
            long tail = Long.parseLong(m2.group(2));

            double decimalPart;
            if (tail < 10)      decimalPart = tail / 10.0;   // 3 triệu 5 -> 3.5
            else if (tail < 100) decimalPart = tail / 100.0;
            else                 decimalPart = tail / 1000.0; // 3 triệu 500 -> 3.5

            return Math.round((millionPart + decimalPart) * 1_000_000L);
        }

        // "3.5 triệu", "3,4tr"
        Pattern pMillion = Pattern.compile("(\\d+(?:\\.\\d+)?)\\s*(triệu|tr)");
        Matcher m = pMillion.matcher(decimalFriendly);
        if (m.find()) {
            double valueMillion = Double.parseDouble(m.group(1));
            return Math.round(valueMillion * 1_000_000L);
        }

        // Số VND thô
        String digitsOnly = lower.replaceAll("[^0-9]", " ");
        String[] tokens = digitsOnly.trim().split("\\s+");
        Long any = null;
        for (String t : tokens) {
            if (t.matches("\\d+")) {
                try { any = Long.parseLong(t); } catch (NumberFormatException ignored) {}
            }
        }
        return any;
        }

    private String formatPriceHuman(Long vnd) {
        if (vnd == null) return "";
        if (vnd >= 1_000_000L) {
            double millions = vnd / 1_000_000.0;
            long rounded = Math.round(millions);
            if (Math.abs(millions - rounded) < 1e-6) return rounded + " triệu";
            double tenTimes = millions * 10;
            long tenRounded = Math.round(tenTimes);
            if (Math.abs(tenTimes - tenRounded) < 1e-6) {
                String s = String.valueOf(tenRounded / 10.0).replace('.', ',');
                return s + " triệu";
            }
        }
        return String.format("%,dđ", vnd);
    }

    /* ================== DTO cho OpenAI ================== */

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

    /* ================== RECORD giữ toán tử giá ================== */
    private record PriceFilter(Operator operator, Long amountVnd, boolean wideRange) {
        enum Operator { LESS, GREATER, EQUAL }
    }
}
