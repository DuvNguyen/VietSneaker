package com.example.clockee_server.service;

import com.example.clockee_server.entity.Product;
import com.example.clockee_server.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.Comparator;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ProductRepository productRepository;

    private static final String SHOP_BASE_URL =
            Optional.ofNullable(System.getenv("SHOP_BASE_URL"))
                    .orElse("http://localhost:3000");

    private final WebClient openai = WebClient.builder()
            .baseUrl("https://api.openai.com/v1")
            .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + System.getenv("OPENAI_API_KEY"))
            .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
            .build();

    public String processMessage(String message) {
        final String msg = message == null ? "" : message.trim();
        final String lower = msg.toLowerCase(Locale.ROOT);

        // 1) Intent: lọc sản phẩm theo giá (ví dụ: "dưới 3 triệu", "< 2500000")
        Long maxPriceLong = tryParseMaxPrice(lower);
        if (maxPriceLong != null) {
            // chuyển Long (VND) sang Double vì entity dùng Double
            Double maxPrice = maxPriceLong.doubleValue();

            // Lấy tối đa 6 sản phẩm rẻ nhất theo điều kiện (repo giờ nhận Double)
            List<Product> products = productRepository.findBySellPriceLessThanEqual(maxPrice);
            if (products == null || products.isEmpty()) {
                return "Không có sản phẩm nào dưới " + (maxPriceLong / 1_000_000) + " triệu 😢";
            }

            // Sắp xếp theo giá tăng dần (dùng double)
            List<Product> top =
                    products.stream()
                            .sorted(Comparator.comparingDouble(p ->
                                    Optional.ofNullable(p.getSellPrice()).orElse(Double.MAX_VALUE)))
                            .limit(6)
                            .collect(Collectors.toList());

            StringBuilder sb = new StringBuilder();
            sb.append("Mình gợi ý ")
              .append(top.size())
              .append(" sản phẩm dưới ")
              .append(maxPriceLong / 1_000_000)
              .append(" triệu:\n");

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

    private Long tryParseMaxPrice(String text) {
        if (text == null || text.isBlank()) return null;

        String normalized = text.replace(".", "").replace(",", "");

        if (normalized.contains("triệu")) {
            String before = normalized.split("triệu")[0];
            String[] tokens = before.trim().split("\\s+");
            for (String t : tokens) {
                if (t.matches("\\d+")) {
                    try {
                        return Long.parseLong(t) * 1_000_000L;
                    } catch (NumberFormatException ignored) {}
                }
            }
        }

        Long any = null;
        String[] tokens = normalized.split("\\s+");
        for (String t : tokens) {
            if (t.matches("\\d+")) {
                try { any = Long.parseLong(t); }
                catch (NumberFormatException ignored) {}
            }
        }
        return any;
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
}
