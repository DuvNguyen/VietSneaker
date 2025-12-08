package com.example.vietsneaker_server.service;

import com.example.vietsneaker_server.entity.Product;

import java.util.List;

public interface ProductService {
    List<Product> getProductsByType(String type);
}
