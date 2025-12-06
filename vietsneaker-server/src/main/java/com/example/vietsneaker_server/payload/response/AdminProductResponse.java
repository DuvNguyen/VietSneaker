package com.example.vietsneaker_server.payload.response;

import com.example.vietsneaker_server.payload.dto.BrandDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminProductResponse {
  private Long productId;
  private String name;
  private String description;
  private Double actualPrice;
  private Double sellPrice;
  private String type;
  private Long stock;
  private BrandDTO brand;
  private Boolean isActive;
  private Boolean visible;
  private byte[] image;
}
