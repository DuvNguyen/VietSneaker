package com.example.vietsneaker_server.payload.request;

import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItemRequest {
  @Min(value = 0, message = "So luong khong duoc am")
  private Long quantity;

  private Long productId;
}
