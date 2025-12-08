package com.example.vietsneaker_server.service;

import lombok.RequiredArgsConstructor;
import okhttp3.*;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class RecommendService {

    @Value("${openai.api.key}")
    private String apiKey;

    private final OkHttpClient client = new OkHttpClient();

    // ⭐ top type
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

    // ⭐ top brand
    public String findTopBrand(List<Map<String, Object>> history) {
        Map<String, Integer> freq = new HashMap<>();

        for (Map<String, Object> item : history) {
            if (item.get("brand") == null) continue;

            String brand = item.get("brand").toString();
            freq.put(brand, freq.getOrDefault(brand, 0) + 1);
        }

        if (freq.isEmpty()) return "";
        return freq.entrySet()
                .stream()
                .max(Map.Entry.comparingByValue())
                .get()
                .getKey();
    }

    // ⭐ AI Recommend
    public String askAI(JSONArray historyJson, JSONArray productJson) {

        String prompt =
                "Dưới đây là lịch sử mua hàng và danh sách sản phẩm." +
                "\nHãy chọn 3 sản phẩm phù hợp nhất, KHÔNG TRÙNG NHAU." +
                "\nTrả về DUY NHẤT JSON ARRAY thuần." +
                "\nFormat: [{\"productId\": 1, \"reason\": \"...\"}]\n\n" +
                "Lịch sử: " + historyJson +
                "\nSản phẩm: " + productJson;

        JSONObject json = new JSONObject();
        json.put("model", "gpt-4o-mini");
        json.put("messages", new JSONArray()
                .put(new JSONObject()
                        .put("role", "system")
                        .put("content", "Chỉ trả về JSON ARRAY"))
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
                .header("HTTP-Referer", "https://example.com")
                .header("X-Title", "Vietsneaker")
                .header("Content-Type", "application/json")
                .post(body)
                .build();

        try (Response response = client.newCall(request).execute()) {

            String raw = response.body().string();
            System.out.println("=== RAW AI RESPONSE ===\n" + raw);

            // 🛑 1) Nếu AI trả về lỗi -> trả về rỗng
            if (raw.contains("\"error\"")) {
                System.out.println("❌ AI ERROR → return empty");
                return "[]";
            }

            // 🛑 2) Parse JSON OpenRouter
            JSONObject full = new JSONObject(raw);

            String content = full
                    .getJSONArray("choices")
                    .getJSONObject(0)
                    .getJSONObject("message")
                    .getString("content")
                    .trim();

            // xoá ```json ```
            if (content.startsWith("```")) {
                content = content.substring(content.indexOf("["));
                content = content.substring(0, content.lastIndexOf("]") + 1);
            }

            // phải là JSON array
            new JSONArray(content);

            return content;
        }
        catch (Exception e) {
            System.out.println("❌ AI PARSE ERROR: " + e.getMessage());
            return "[]";
        }
    }
}
