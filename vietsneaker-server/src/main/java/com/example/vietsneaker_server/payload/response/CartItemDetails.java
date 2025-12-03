package com.example.vietsneaker_server.payload.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItemDetails {
  private Long productId;
  private String name;
  private Long quantity;
  private Double price;
  private byte[] image;
}
