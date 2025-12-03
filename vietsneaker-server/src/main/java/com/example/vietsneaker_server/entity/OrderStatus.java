package com.example.vietsneaker_server.entity;

import com.example.vietsneaker_server.util.Client;

import lombok.Getter;

@Client
@Getter
public enum OrderStatus {
  PENDING("PENDING", "Chưa giải quyết", "order-pending", "Đơn hàng của bạn đang chờ xác nhận"),
  PROCESSING("PROCESSING", "Đang xử lý", "order-confirmed", "Đơn hàng của bạn đã được xác nhận"),
  SHIPPED("SHIPPED", "Đã giao", "order-shipped", "Đơn hàng của bạn đang được vận chuyển"),
  RETURNING("RETURNING", "Đang hoàn trả", null, null),
  RETURNED("RETURNED", "Đã hoàn trả", "order-returned", "Đã xác nhận trả hàng cho đơn của bạn"),
  CANCELLED("CANCELLED", "Bị hủy", "order-cancelled", "Đơn hàng của bạn đã bị hủy"),
  COMPLETED("COMPLETED", "Hoàn tất", "order-success", "Đơn hàng của bạn đã được giao thành công!");

  private final String name;
  private final String value;
  private final String emailTemplate;
  private final String emailTitle;

  // OrderStatus(String value, String name) {
  // this.name = name;
  // this.value = value;
  // }
  OrderStatus(String value, String name, String trackingEmailTemplate, String emailTitle) {
    this.name = name;
    this.value = value;
    this.emailTemplate = trackingEmailTemplate;
    this.emailTitle = emailTitle;
  }

  @Override
  public String toString() {
    return value;
  }
}
