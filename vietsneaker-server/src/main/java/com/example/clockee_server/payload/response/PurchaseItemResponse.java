package com.example.clockee_server.payload.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PurchaseItemResponse {

  private Long productId;
  private Long quantity;
  private Double price;
  private Long supplierId;
}
