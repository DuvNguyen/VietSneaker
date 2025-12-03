package com.example.vietsneaker_server.mapper;

import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.example.vietsneaker_server.entity.Order;
import com.example.vietsneaker_server.entity.OrderItem;
import com.example.vietsneaker_server.file.FileStorageService;
import com.example.vietsneaker_server.payload.response.OrderItemSummary;
import com.example.vietsneaker_server.payload.response.OrderSummaryResponse;

/** OrderMapper */
@Service
@RequiredArgsConstructor
public class OrderMapper {
  private final ModelMapper mapper;
  private final FileStorageService fileStorageService;

  public OrderItemSummary orderItemToOrderItemSummary(OrderItem item) {
    var summaryItem = mapper.map(item, OrderItemSummary.class);
    summaryItem.setName(item.getProduct().getName());
    summaryItem.setImage(fileStorageService.readFileFromLocation(item.getProduct().getImageUrl()));
    return summaryItem;
  }

  public OrderSummaryResponse orderToOrderSummary(Order order) {
    var orderSummary = mapper.map(order, OrderSummaryResponse.class);
    var summaryItems =
        order.getOrderItems().stream()
            .map(
                (item) -> {
                  return orderItemToOrderItemSummary(item);
                })
            .collect(Collectors.toList());

    orderSummary.setOrderItems(summaryItems);
    return orderSummary;
  }
}
