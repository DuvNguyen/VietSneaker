package com.example.clockee_server.mapper;

import com.example.clockee_server.entity.Product;
import com.example.clockee_server.file.FileStorageService;
import com.example.clockee_server.payload.response.AdminProductResponse;
import com.example.clockee_server.payload.response.ProductDetailsResponse;
import com.example.clockee_server.payload.response.ProductSummaryResponse;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

/** ProductMapper */
@Service
@RequiredArgsConstructor
public class ProductMapper {
  private final ModelMapper mapper;
  private final FileStorageService fileStorageService;

  public AdminProductResponse productToAdminResponse(Product product) {
    var dto = mapper.map(product, AdminProductResponse.class);
    dto.setImage(fileStorageService.readFileFromLocation(product.getImageUrl()));
    return dto;
  }

  public ProductSummaryResponse productToProductSummary(Product product) {
    var dto = mapper.map(product, ProductSummaryResponse.class);
    dto.setImage(fileStorageService.readFileFromLocation(product.getImageUrl()));
    return dto;
  }

  public ProductDetailsResponse productToProductDetails(Product product) {
    var dto = mapper.map(product, ProductDetailsResponse.class);
    dto.setImage(fileStorageService.readFileFromLocation(product.getImageUrl()));
    return dto;
  }
}
