package com.example.vietsneaker_server.service;


import com.example.vietsneaker_server.entity.Product;


import java.util.List;


public interface ProductService {


    // ⭐ Lấy theo type HOẶC brand (your requirement)
    List<Product> getProductsByTypeOrBrand(String type, String brand);
}
