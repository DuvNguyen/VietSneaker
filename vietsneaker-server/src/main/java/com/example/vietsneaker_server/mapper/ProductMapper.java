package com.example.vietsneaker_server.mapper;

import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.example.vietsneaker_server.entity.Product;
import com.example.vietsneaker_server.file.FileStorageService;
import com.example.vietsneaker_server.payload.response.AdminProductResponse;
import com.example.vietsneaker_server.payload.response.ProductDetailsResponse;
import com.example.vietsneaker_server.payload.response.ProductSummaryResponse;

/** ProductMapper */
@Service
@RequiredArgsConstructor
public class ProductMapper {
  private final ModelMapper mapper;
  private final FileStorageService fileStorageService;

  public AdminProductResponse productToAdminResponse(Product product) {
    var dto = mapper.map(product, AdminProductResponse.class);
    // TẠM TẮT LOAD ẢNH ĐỂ TRÁNH LỖI 500 TRÊN DOCKER
    // dto.setImage(fileStorageService.readFileFromLocation(product.getImageUrl()));
    return dto;
  }

  public ProductSummaryResponse productToProductSummary(Product product) {
    var dto = mapper.map(product, ProductSummaryResponse.class);
    // TẠM TẮT LOAD ẢNH
    // dto.setImage(fileStorageService.readFileFromLocation(product.getImageUrl()));
    return dto;
  }

  public ProductDetailsResponse productToProductDetails(Product product) {
    var dto = mapper.map(product, ProductDetailsResponse.class);
    // TẠM TẮT LOAD ẢNH
    // dto.setImage(fileStorageService.readFileFromLocation(product.getImageUrl()));
    return dto;
  }
}