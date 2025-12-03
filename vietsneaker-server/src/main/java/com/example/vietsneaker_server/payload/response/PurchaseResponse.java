package com.example.vietsneaker_server.payload.response;

import java.util.Set;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PurchaseResponse {
  private Long purchaseId;
  private Set<PurchaseItemResponse> items;
  private Double totalPrice;
}
