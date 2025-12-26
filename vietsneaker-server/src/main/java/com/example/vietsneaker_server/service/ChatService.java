package com.example.vietsneaker_server.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.example.vietsneaker_server.entity.Product;
import com.example.vietsneaker_server.repository.ProductRepository;

import reactor.core.publisher.Mono;

import jakarta.annotation.PostConstruct;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import java.util.Comparator;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ProductRepository productRepository;

    // ✅ LẤY BASE URL TỪ SPRING CONFIG
    @Value("${shop.base.url}")
    private String shopBaseUrl;

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

        // Log để check
        System.out.println("SHOP BASE URL = " + shopBaseUrl);
    }

    public String processMessage(String message) {
        final String msg = message == null ? "" : message.trim();

        // 1️⃣ INTENT: LỌC THEO GIÁ
        PriceFilter priceFilter = tryParsePriceFilter(msg);
        if (priceFilter != null && priceFilter.amountVnd() != null) {

            double value = priceFilter.amountVnd();
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
                    double percent = priceFilter.wideRange() ? 0.20 : 0.05;
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
                if (p.getProductId() != null) {
                    sb.append("- ")
                      .append(shopBaseUrl)
                      .append("/product/")
                      .append(p.getProductId())
                      .append("\n");
                }
            }

            return sb.toString().trim();
        }

        // 2️⃣ CÂU HỎI KHÁC → OPENAI
        OpenAIChatRequest req = new OpenAIChatRequest();
        req.setModel("gpt-4.1-mini");
        req.setMax_tokens(300);

        List<OpenAIChatRequest.Message> msgs = new ArrayList<>();
        msgs.add(new OpenAIChatRequest.Message(
                "system",
                "Bạn là trợ lý tư vấn bán hàng cho VietSneaker. Trả lời ngắn gọn, thân thiện, tiếng Việt."
        ));
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
                    fallback.setChoices(List.of(c));
                    return Mono.just(fallback);
                })
                .block();

        return Optional.ofNullable(resp)
                .map(OpenAIChatResponse::getChoices)
                .filter(list -> !list.isEmpty())
                .map(list -> list.get(0).getMessage().getContent())
                .orElse("Xin lỗi, mình chưa có câu trả lời phù hợp.");
    }

    // ================== PARSE GIÁ ==================

    private PriceFilter tryParsePriceFilter(String text) {
        if (text == null || text.isBlank()) return null;

        String lower = text.toLowerCase(Locale.ROOT);
        Long amount = extractAmountVnd(lower);
        if (amount == null) return null;

        boolean less = lower.contains("dưới") || lower.contains("<");
        boolean greater = lower.contains("trên") || lower.contains(">") || lower.contains("từ");
        boolean approx = lower.contains("khoảng") || lower.contains("tầm") || lower.contains("xấp xỉ");

        PriceFilter.Operator op =
                less ? PriceFilter.Operator.LESS :
                greater ? PriceFilter.Operator.GREATER :
                PriceFilter.Operator.EQUAL;

        return new PriceFilter(op, amount, approx);
    }

    private Long extractAmountVnd(String text) {
        String t = text.replace(",", ".").toLowerCase();

        Pattern p1 = Pattern.compile("(\\d+(?:\\.\\d+)?)\\s*(triệu|tr)");
        Matcher m1 = p1.matcher(t);
        if (m1.find()) {
            return Math.round(Double.parseDouble(m1.group(1)) * 1_000_000);
        }

        Pattern p2 = Pattern.compile("(\\d+)");
        Matcher m2 = p2.matcher(t);
        if (m2.find()) {
            return Long.parseLong(m2.group(1));
        }
        return null;
    }

    private String formatPriceHuman(Long vnd) {
        if (vnd >= 1_000_000) {
            double m = vnd / 1_000_000.0;
            return (m % 1 == 0 ? (long) m : String.valueOf(m).replace('.', ',')) + " triệu";
        }
        return String.format("%,dđ", vnd);
    }

    // ================== DTO ==================

    public static class OpenAIChatRequest {
        private String model;
        private List<Message> messages;
        private Integer max_tokens;

        public static class Message {
            private String role;
            private String content;
            public Message() {}
            public Message(String role, String content) {
                this.role = role;
                this.content = content;
            }
            public String getRole() { return role; }
            public String getContent() { return content; }
            public void setRole(String role) { this.role = role; }
            public void setContent(String content) { this.content = content; }
        }

        public void setModel(String model) { this.model = model; }
        public void setMessages(List<Message> messages) { this.messages = messages; }
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
            public String getContent() { return content; }
            public void setRole(String role) { this.role = role; }
            public void setContent(String content) { this.content = content; }
        }

        public List<Choice> getChoices() { return choices; }
        public void setChoices(List<Choice> choices) { this.choices = choices; }
    }

    private record PriceFilter(Operator operator, Long amountVnd, boolean wideRange) {
        enum Operator { LESS, GREATER, EQUAL }
    }
}
