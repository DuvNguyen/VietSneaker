package com.example.clockee_server.payload.response;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PurchaseSummary {

  private Long purchaseId;
  private Double totalPrice;
  private LocalDateTime createdAt;
  private String status;
  private String createdByUsername;
}
