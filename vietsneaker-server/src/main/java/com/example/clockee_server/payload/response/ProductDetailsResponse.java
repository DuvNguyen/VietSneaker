package com.example.clockee_server.payload.response;

import com.example.clockee_server.payload.dto.BrandDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ProductDetailsResponse {
  private Long productId;
  private String name;
  private byte[] image;
  private Double sellPrice;
  private String description;
  private BrandDTO brand;
  private String type;
  private String shoeSize;
  private Boolean isActive;
  private Long stock;
}
