package com.example.clockee_server.payload.response;

import java.util.Set;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PurchaseDetails {
  private Long purchaseId;
  private Set<PurchaseItemDetails> items;
}
