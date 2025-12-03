package com.example.vietsneaker_server.payload.request;

import com.example.vietsneaker_server.entity.OrderStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/** UpdateOrderStatusRequest */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateOrderStatusRequest {
  private OrderStatus status;
}
