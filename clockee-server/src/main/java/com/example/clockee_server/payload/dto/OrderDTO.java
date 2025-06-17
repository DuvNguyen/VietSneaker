package com.example.clockee_server.payload.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderDTO {
  private Long totalOrders;
  private Long finishOrders;
  private Long otherOrders;
}
