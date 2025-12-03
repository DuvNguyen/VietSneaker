package com.example.vietsneaker_server.email.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** OrderEmailInfo */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderEmailContext {
  private String customerName;
  private String orderCode;

  private String shippedDate;
  private String deliveredDate;
  private String confirmedDate;
  private String cancelledDate;
  private String returnDate;
  private String orderDate;

  private String address;
  private String phone;
  private String totalPrice;
  private String applicationName;
}
