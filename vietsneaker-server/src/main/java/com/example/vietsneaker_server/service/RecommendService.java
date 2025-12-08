package com.example.vietsneaker_server.service;

import lombok.RequiredArgsConstructor;
import okhttp3.*;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.*;

@Service
@RequiredArgsConstructor
public class RecommendService {

    @Value("${openai.api.key}")
    private String apiKey;

    private final OkHttpClient client = new OkHttpClient();

    // ⭐ Tìm loại sản phẩm được mua nhiều nhất
    public String findTopType(List<Map<String, Object>> history) {
        Map<String, Integer> freq = new HashMap<>();

        for (Map<String, Object> item : history) {
            String type = item.get("type").toString();
            freq.put(type, freq.getOrDefault(type, 0) + 1);
        }

        return freq.entrySet()
                .stream()
                .max(Map.Entry.comparingByValue())
                .get()
                .getKey();
    }

    // ⭐ Gửi request sang OpenRouter AI
    public String askAI(JSONArray historyJson, JSONArray productJson) {

        // PROMPT BẮT BUỘC AI TRẢ VỀ JSON ARRAY THUẦN
        String prompt =
                "Dưới đây là lịch sử mua hàng và danh sách sản phẩm." +
                "\nHãy chọn 3 sản phẩm phù hợp nhất, KHÔNG TRÙNG NHAU." +
                "\nTrả về DUY NHẤT một JSON ARRAY thuần (không thêm chữ, không markdown, không ```json)." +
                "\nFormat bắt buộc:\n" +
                "[{\"productId\": 1, \"reason\": \"lý do\"}]\n\n" +
                "Lịch sử: " + historyJson +
                "\nSản phẩm: " + productJson;

        JSONObject json = new JSONObject();
        json.put("model", "gpt-4o-mini");
        json.put("messages", new JSONArray()
                .put(new JSONObject()
                        .put("role", "system")
                        .put("content", "Bạn là hệ thống gợi ý sneaker, chỉ trả về JSON ARRAY."))
                .put(new JSONObject()
                        .put("role", "user")
                        .put("content", prompt)));

        RequestBody body = RequestBody.create(
                json.toString(),
                MediaType.parse("application/json")
        );

        Request request = new Request.Builder()
                .url("https://openrouter.ai/api/v1/chat/completions")
                .header("Authorization", "Bearer " + apiKey)
                .header("Content-Type", "application/json")
                .post(body)
                .build();

        try (Response response = client.newCall(request).execute()) {

            String raw = response.body().string();
            System.out.println("=== RAW AI RESPONSE ===\n" + raw);

            // Lấy phần content thực từ AI
            JSONObject obj = new JSONObject(raw);
            String content = obj
                    .getJSONArray("choices")
                    .getJSONObject(0)
                    .getJSONObject("message")
                    .getString("content")
                    .trim();

            // CẮT BỎ ```json ... ```
            if (content.startsWith("```")) {
                content = content.substring(content.indexOf("["));
                content = content.substring(0, content.lastIndexOf("]") + 1);
            }

            // KIỂM TRA JSON ARRAY
            if (!content.startsWith("[")) {
                throw new RuntimeException("AI DID NOT RETURN JSON ARRAY: " + content);
            }

            // Validate JSON
            new JSONArray(content);

            return content; // FE nhận đúng dạng JSON ARRAY
        }
        catch (Exception e) {
            return "ERROR: " + e.getMessage();
        }
    }
}
