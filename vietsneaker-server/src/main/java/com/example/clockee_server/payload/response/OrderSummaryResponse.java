package com.example.clockee_server.payload.response;

import java.time.LocalDateTime;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderSummaryResponse {
  private Long orderId;
  private LocalDateTime createdAt;
  private List<OrderItemSummary> orderItems;
  private Double totalPrice;
  private String status;
  private String address;
}
