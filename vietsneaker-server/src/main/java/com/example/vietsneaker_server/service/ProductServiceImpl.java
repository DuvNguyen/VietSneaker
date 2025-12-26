package com.example.vietsneaker_server.service;


import com.example.vietsneaker_server.entity.Product;
import com.example.vietsneaker_server.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.util.List;


@Service
public class ProductServiceImpl implements ProductService {


    @Autowired
    private ProductRepository productRepository;


    @Override
    public List<Product> getProductsByTypeOrBrand(String type, String brandName) {
        return productRepository.findByTypeOrBrand_Name(type, brandName);
    }
}
