package com.example.clockee_server.controller.user;

import com.example.clockee_server.auth.annotation.CurrentUser;
import com.example.clockee_server.config.ApplicationConstants;
import com.example.clockee_server.entity.OrderStatus;
import com.example.clockee_server.entity.User;
import com.example.clockee_server.message.AppMessage;
import com.example.clockee_server.message.MessageKey;
import com.example.clockee_server.payload.request.CreateOrderRequest;
import com.example.clockee_server.payload.response.OrderSummaryResponse;
import com.example.clockee_server.service.user.OrderService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/** OrderController */
@RestController
@RequestMapping(ApplicationConstants.USER_URL_PREFIX + "/order")
@RequiredArgsConstructor
public class OrderController {
  private final OrderService orderService;

  @GetMapping
  @PreAuthorize("isAuthenticated()")
  public ResponseEntity<List<OrderSummaryResponse>> getAllOrders(
      @CurrentUser User user,
      @RequestParam(value = "status", required = false) OrderStatus status) {
    List<OrderSummaryResponse> orders = orderService.getAllByUser(user, status);
    return ResponseEntity.ok(orders);
  }

  @PostMapping("/{orderId}/cancel")
  public ResponseEntity<String> cancelOrder(@PathVariable Long orderId, @CurrentUser User user) {
    orderService.cancelOrder(orderId, user);
    return ResponseEntity.ok(AppMessage.of(MessageKey.UPDATED_SUCCESS));
  }

  @PostMapping
  public ResponseEntity<?> createOrder(
      @CurrentUser User user, @RequestBody CreateOrderRequest request) {
    orderService.createOrder(user, request);
    return ResponseEntity.accepted().build();
  }
}
