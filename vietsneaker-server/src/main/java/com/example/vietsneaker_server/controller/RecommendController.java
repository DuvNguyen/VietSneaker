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
            return List.of();
        }

        // 1. Lấy type & brand phổ biến
        String type = recommendService.findTopType(history);
        String brand = recommendService.findTopBrand(history);

        // 2. Lấy products theo type OR brand
        List<Product> products = productService.getProductsByTypeOrBrand(type, brand);

        JSONArray historyJson = new JSONArray(history);

        JSONArray productJson = new JSONArray();
        for (Product p : products) {
            productJson.put(Map.of(
                    "productId", p.getProductId(),
                    "name", p.getName(),
                    "type", p.getType(),
                    "brand", p.getBrand().getName(),
                    "price", p.getSellPrice()
            ));
        }

        // 3. Gọi AI
        String aiResult = recommendService.askAI(historyJson, productJson);
        System.out.println("productJson = " + productJson);
        System.out.println("AI RAW RESPONSE = " + aiResult);

        // 4. AIResult LÚC NÀY LÀ JSON ARRAY → chỉ cần parse bằng JSONArray
        try {
            JSONArray arr = new JSONArray(aiResult); // ← THIS IS THE FIX!

            return arr.toList(); // FE cần List<Map>
        } catch (Exception e) {
            System.out.println("ERROR PARSING AI JSON: " + e.getMessage());
            return List.of();
        }
    }
}
