package com.example.vietsneaker_server.payload.response;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartDetailsResponse {
  private List<CartItemDetails> items;
  private Double totalPrice;
}
