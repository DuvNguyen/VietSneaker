package com.example.vietsneaker_server.controller.admin;

import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.vietsneaker_server.config.ApplicationConstants;
import com.example.vietsneaker_server.entity.OrderStatus;
import com.example.vietsneaker_server.payload.PageResponse;
import com.example.vietsneaker_server.payload.dto.MonthlyRevenueDTO;
import com.example.vietsneaker_server.payload.dto.OrderDTO;
import com.example.vietsneaker_server.payload.request.UpdateOrderStatusRequest;
import com.example.vietsneaker_server.payload.response.AdminOrderSummaryResponse;
import com.example.vietsneaker_server.service.admin.AdminOrderService;

@RestController
@RequestMapping(ApplicationConstants.ADMIN_URL_PREFIX + "/order")
public class AdminOrderController {
  @Autowired private AdminOrderService orderService;

  @GetMapping("/by-month-year")
  public Double getRevenueByMonthAndYear(
      @RequestParam("year") int year, @RequestParam("month") int month) {
    return orderService.getRevenueByMonthAndYear(year, month);
  }

  @GetMapping("/monthly")
  public List<MonthlyRevenueDTO> getMonthlyRevenue() {
    return orderService.calculateMonthlyRevenue();
  }

  @GetMapping("/by-year")
  public List<Double> getMonthlyRevenueInYear(@RequestParam("year") int year) {
    List<Double> revenues = new ArrayList<>();

    for (int month = 1; month <= 12; month++) {
      Double revenue = orderService.getRevenueByMonthAndYear(year, month);
      revenues.add(revenue);
    }

    return ResponseEntity.ok(revenues).getBody();
  }

  @GetMapping("/order-by-year")
  public OrderDTO getYearlyOrder(@RequestParam("year") int year) {
    return orderService.getYearlyOrder(year);
  }

  @GetMapping
  public ResponseEntity<PageResponse<AdminOrderSummaryResponse>> getOrderSummary(
      @RequestParam(value = "status", required = false) OrderStatus status,
      @RequestParam(defaultValue = ApplicationConstants.PAGE_NUMBER) int page,
      @RequestParam(defaultValue = ApplicationConstants.PAGE_SIZE) int size) {
    PageResponse<AdminOrderSummaryResponse> orders = orderService.getAllOrder(page, size, status);
    return ResponseEntity.ok(orders);
  }

  @PutMapping("{orderId}")
  public ResponseEntity<?> updateOrderStatus(
      @PathVariable Long orderId, @RequestBody UpdateOrderStatusRequest request) {
    orderService.updateStatus(orderId, request);
    return ResponseEntity.accepted().build();
  }
}
