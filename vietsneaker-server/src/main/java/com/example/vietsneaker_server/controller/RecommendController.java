package com.example.vietsneaker_server.controller;

import com.example.vietsneaker_server.entity.Product;
import com.example.vietsneaker_server.service.ProductService;
import com.example.vietsneaker_server.service.RecommendService;
import org.json.JSONArray;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/recommend")
public class RecommendController {

    @Autowired
    private RecommendService recommendService;

    @Autowired
    private ProductService productService;

    @PostMapping
    public Object recommend(@RequestBody Map<String, Object> req) {

        System.out.println("REQ = " + req);

        List<Map<String, Object>> history = (List<Map<String, Object>>) req.get("history");

        if (history == null || history.isEmpty()) {
            return List.of(); // trả về mảng rỗng FE sẽ không lỗi
        }

        // 1. Lấy type phổ biến nhất
        String type = recommendService.findTopType(history);

        // 2. Lấy danh sách sản phẩm cùng type
        List<Product> products = productService.getProductsByType(type);

        // Tạo JSON gửi cho AI
        JSONArray historyJson = new JSONArray(history);

        JSONArray productJson = new JSONArray();
        for (Product p : products) {
            productJson.put(Map.of(
                    "productId", p.getProductId(),
                    "name", p.getName(),
                    "type", p.getType(),
                    "price", p.getSellPrice()
            ));
        }

        // 3. Gọi AI
        String aiResult = recommendService.askAI(historyJson, productJson);
        System.out.println("ProductJson = " + productJson);
        System.out.println("AI Raw Result = " + aiResult);

        // 4. Parse AI JSON ARRAY TRẢ VỀ
        // 🔥 Quan trọng: AI phải trả về đúng dạng:
        // [
        //    {"productId": 1, "reason": "..."},
        //    {"productId": 3, "reason": "..."}
        // ]
        try {
            JSONArray arr = new JSONArray(aiResult);

            // Convert JSONArray → List<Map>
            return arr.toList();

        } catch (Exception e) {
            System.out.println("❌ Lỗi parse JSON từ AI: " + e.getMessage());
            return List.of(); // tránh FE bị lỗi
        }
    }
}
