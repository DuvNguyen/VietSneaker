package com.example.vietsneaker_server.service.admin;

import java.text.NumberFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.EnumSet;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import lombok.extern.log4j.Log4j2;
import org.jobrunr.scheduling.BackgroundJobRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.example.vietsneaker_server.email.dto.OrderEmailContext;
import com.example.vietsneaker_server.entity.Order;
import com.example.vietsneaker_server.entity.OrderStatus;
import com.example.vietsneaker_server.entity.User;
import com.example.vietsneaker_server.exception.ApiException;
import com.example.vietsneaker_server.exception.ResourceNotFoundException;
import com.example.vietsneaker_server.jobs.requests.SendOrderTrackingEmailJob;
import com.example.vietsneaker_server.mapper.MapperUtil;
import com.example.vietsneaker_server.mapper.OrderMapper;
import com.example.vietsneaker_server.message.AppMessage;
import com.example.vietsneaker_server.message.MessageKey;
import com.example.vietsneaker_server.payload.PageResponse;
import com.example.vietsneaker_server.payload.dto.MonthlyRevenueDTO;
import com.example.vietsneaker_server.payload.dto.OrderDTO;
import com.example.vietsneaker_server.payload.request.UpdateOrderStatusRequest;
import com.example.vietsneaker_server.payload.response.AdminOrderSummaryResponse;
import com.example.vietsneaker_server.repository.OrderRepository;
import com.example.vietsneaker_server.repository.ProductRepository;
import com.example.vietsneaker_server.specification.OrderSpecification;

/** AdminOrderService */
@Service
@Log4j2
public class AdminOrderService {
  @Autowired private OrderRepository orderRepository;
  @Autowired private OrderMapper mapper;
  @Autowired private ProductRepository productRepository;

  @Value("${spring.application.name}")
  private String applicationName;

  public List<MonthlyRevenueDTO> calculateMonthlyRevenue() {
    List<Object[]> results = orderRepository.getMonthlyRevenue();
    List<MonthlyRevenueDTO> revenueList = new ArrayList<>();

    for (Object[] result : results) {
      Integer year = (Integer) result[0];
      Integer month = (Integer) result[1];
      Double revenue = (Double) result[2];

      revenueList.add(new MonthlyRevenueDTO(year, month, revenue));
    }
    return revenueList;
  }

  public OrderDTO getYearlyOrder(int year) {
    Long totalOrders = orderRepository.countOrdersByYear(year);
    Long shippedOrders = orderRepository.countOrdersByYearAndStatus(year, OrderStatus.SHIPPED);
    Long completedOrders = orderRepository.countOrdersByYearAndStatus(year, OrderStatus.COMPLETED);
    Long pendingOrders = orderRepository.countOrdersByYearAndStatus(year, OrderStatus.PENDING);
    Long processingOrders =
        orderRepository.countOrdersByYearAndStatus(year, OrderStatus.PROCESSING);
    Long returningOrders = orderRepository.countOrdersByYearAndStatus(year, OrderStatus.RETURNING);
    Long returnedOrders = orderRepository.countOrdersByYearAndStatus(year, OrderStatus.RETURNED);
    Long cancelledOrders = orderRepository.countOrdersByYearAndStatus(year, OrderStatus.CANCELLED);

    totalOrders = totalOrders != null ? totalOrders : 0L;
    shippedOrders = shippedOrders != null ? shippedOrders : 0L;
    completedOrders = completedOrders != null ? completedOrders : 0L;
    pendingOrders = pendingOrders != null ? pendingOrders : 0L;
    processingOrders = processingOrders != null ? processingOrders : 0L;
    returningOrders = returningOrders != null ? returningOrders : 0L;
    returnedOrders = returnedOrders != null ? returnedOrders : 0L;
    cancelledOrders = cancelledOrders != null ? cancelledOrders : 0L;

    Long finishOrders = shippedOrders + completedOrders;
    Long otherOrders =
        pendingOrders + processingOrders + returningOrders + returnedOrders + cancelledOrders;

    return new OrderDTO(totalOrders, finishOrders, otherOrders);
  }

  public Double getRevenueByMonthAndYear(int year, int month) {
    log.info("Calling getRevenueByMonthAndYear with year: " + year + ", month: " + month);

    Optional<Double> revenue = orderRepository.getRevenueByMonthAndYear(year, month);

    if (revenue.isPresent()) {
      log.info("Revenue found: " + revenue.get());
    } else {
      log.info("No revenue found for year: " + year + ", month: " + month);
    }

    return revenue.orElse(0.0);
  }

  public PageResponse<AdminOrderSummaryResponse> getAllOrder(
      int page, int size, OrderStatus status) {
    Pageable pageable = PageRequest.of(page, size);

    Specification<Order> specification =
        OrderSpecification.fetchUsers()
            .and(OrderSpecification.withStatus(status))
            .and(OrderSpecification.orderByLatest());
    Page<Order> orders = orderRepository.findAll(specification, pageable);

    return MapperUtil.mapPageResponse(
        orders,
        (order) -> {
          AdminOrderSummaryResponse orderSummary =
              MapperUtil.mapObject(order, AdminOrderSummaryResponse.class);
          orderSummary.setCustomerName(order.getUser().getName());
          return orderSummary;
        });
  }

  /** Determine order should be send email to user for notify order status change or not */
  private boolean isSendEmailOrderChange(OrderStatus current, OrderStatus next) {

    // Proccess order status transition in order will notify as email
    Map<OrderStatus, OrderStatus> normalStatusFlow = new HashMap<>();
    normalStatusFlow.put(OrderStatus.PENDING, OrderStatus.PROCESSING);
    normalStatusFlow.put(OrderStatus.PROCESSING, OrderStatus.SHIPPED);
    normalStatusFlow.put(OrderStatus.SHIPPED, OrderStatus.COMPLETED);
    if (normalStatusFlow.containsKey(current) && normalStatusFlow.get(current).equals(next)) {
      return true;
    }

    // Order cancelled by admin or order returned approved by admin will notify user
    if (next.equals(OrderStatus.CANCELLED) || next.equals(OrderStatus.RETURNED)) {
      return true;
    }

    return false;
  }

  private void throwIfInvalidOrderStatusChange(OrderStatus current, OrderStatus next) {
    if (next.equals(OrderStatus.CANCELLED)) {
      EnumSet<OrderStatus> whiteListReturnStatus =
          EnumSet.of(OrderStatus.PENDING, OrderStatus.PROCESSING);
      if (!whiteListReturnStatus.contains(current)) {
        throw ApiException.builder()
            .status(400)
            .message(AppMessage.of(MessageKey.INVALID_ORDERSTATUS_FLOW))
            .build();
      }
    }

    if (next.equals(OrderStatus.RETURNED)) {
      if (!current.equals(OrderStatus.RETURNING)) {
        throw ApiException.builder()
            .status(400)
            .message(AppMessage.of(MessageKey.INVALID_ORDERSTATUS_FLOW))
            .build();
      }
    }
  }

  public void updateStatus(Long orderId, UpdateOrderStatusRequest request) {
    OrderStatus newStatus = request.getStatus();
    Order order =
        orderRepository.findById(orderId).orElseThrow(() -> new ResourceNotFoundException("order"));
    User user = order.getUser();

    throwIfInvalidOrderStatusChange(order.getStatus(), newStatus);

    if (isSendEmailOrderChange(order.getStatus(), newStatus)) {
      DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
      String formattedDate = LocalDate.now().format(formatter);
      Locale vietnamLocale = new Locale("vi", "VN");
      NumberFormat currencyFormatter = NumberFormat.getCurrencyInstance(vietnamLocale);
      String formatedTotalPrice = currencyFormatter.format(order.getTotalPrice());
      var emailInfo =
          OrderEmailContext.builder()
              .customerName(user.getName())
              .orderCode(order.getOrderId().toString())
              .shippedDate(formattedDate)
              .deliveredDate(formattedDate)
              .cancelledDate(formattedDate)
              .confirmedDate(formattedDate)
              .orderDate(formattedDate)
              .returnDate(formattedDate)
              .address(user.getAddress())
              .phone(user.getPhone())
              .totalPrice(formatedTotalPrice)
              .applicationName(applicationName)
              .build();

      SendOrderTrackingEmailJob sendOrderTrackingEmailJob =
          new SendOrderTrackingEmailJob(emailInfo, newStatus, user.getEmail());
      BackgroundJobRequest.enqueue(sendOrderTrackingEmailJob);
    }

    order.setStatus(newStatus);
    orderRepository.save(order);
  }
}
