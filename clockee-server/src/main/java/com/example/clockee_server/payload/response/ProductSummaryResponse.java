package com.example.clockee_server.payload.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ProductSummaryResponse {
  private Long productId;
  private String name;
  private byte[] image;
  private Double sellPrice;
  private String type;
  private Boolean isActive;
  private Long stock;
}
