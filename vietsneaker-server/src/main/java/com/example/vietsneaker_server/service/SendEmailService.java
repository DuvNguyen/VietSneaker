package com.example.vietsneaker_server.service;

import com.example.vietsneaker_server.email.dto.OrderEmailContext;
import com.example.vietsneaker_server.entity.OrderStatus;

import jakarta.validation.constraints.NotNull;

/** EmailService */
public interface SendEmailService {

  void sendWelcomeEmail(@NotNull Long userId);

  void sendOrderTrackingEmail(
      OrderStatus orderStatus, OrderEmailContext orderContext, String userEmail);
}
