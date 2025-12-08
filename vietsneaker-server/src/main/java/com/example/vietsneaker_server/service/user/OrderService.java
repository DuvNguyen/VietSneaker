package com.example.vietsneaker_server.service.user;
import com.example.vietsneaker_server.payload.response.ProductHistoryDTO;

import java.util.ArrayList;
import java.util.EnumSet;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.vietsneaker_server.entity.CartItem;
import com.example.vietsneaker_server.entity.Order;
import com.example.vietsneaker_server.entity.OrderItem;
import com.example.vietsneaker_server.entity.OrderStatus;
import com.example.vietsneaker_server.entity.Product;
import com.example.vietsneaker_server.entity.User;
import com.example.vietsneaker_server.exception.ApiException;
import com.example.vietsneaker_server.exception.ResourceNotFoundException;
import com.example.vietsneaker_server.mapper.OrderMapper;
import com.example.vietsneaker_server.message.AppMessage;
import com.example.vietsneaker_server.message.MessageKey;
import com.example.vietsneaker_server.payload.request.CreateOrderRequest;
import com.example.vietsneaker_server.payload.response.OrderSummaryResponse;
import com.example.vietsneaker_server.repository.CartRepository;
import com.example.vietsneaker_server.repository.OrderItemRepository;
import com.example.vietsneaker_server.repository.OrderRepository;
import com.example.vietsneaker_server.repository.ProductRepository;
import com.example.vietsneaker_server.specification.OrderSpecification;

@Service
@Log4j2
@RequiredArgsConstructor
public class OrderService {
  private final OrderMapper mapper;
  private final ProductRepository productRepository;
  
  private final CartRepository cartRepository;
  private final OrderItemRepository orderItemRepository;
  private final OrderRepository orderRepository;
  
  public List<OrderSummaryResponse> getAllByUser(User user, OrderStatus status) {

    Specification<Order> specification =
        OrderSpecification.withUserId(user.getUserId())
            .and(OrderSpecification.withStatus(status))
            .and(OrderSpecification.orderByLatest());
    return orderRepository.findAll(specification).stream()
        .map(mapper::orderToOrderSummary)
        .collect(Collectors.toList());
  }

  @Transactional
  public void cancelOrder(Long orderId, User user) {
    Order order =
        orderRepository
            .findByUserIdAndOrderIdWithItems(user.getUserId(), orderId)
            .orElseThrow(() -> new ResourceNotFoundException("order"));

    EnumSet<OrderStatus> allowCancelStatus =
        EnumSet.of(OrderStatus.PENDING, OrderStatus.PROCESSING);
    if (!allowCancelStatus.contains(order.getStatus())) {
      throw ApiException.builder()
          .message(AppMessage.of(MessageKey.BAD_ORDER_STATUS))
          .status(400)
          .build();
    }

    List<Product> products = new ArrayList<>();
    for (OrderItem item : order.getOrderItems()) {
      Product product = item.getProduct();
      product.setStock(product.getStock() + item.getQuantity());
      products.add(product);
    }
    productRepository.saveAll(products);

    order.setStatus(OrderStatus.CANCELLED);
    orderRepository.save(order);
  }

  @Transactional
  public void createOrder(User user, CreateOrderRequest request) {

    // Only allow user to create order from items in cart => Search item in cart
    // with map
    var cartItems = cartRepository.findByUserId(user.getUserId());
    Map<Long, CartItem> productIdToCartItem = new HashMap<>();
    for (var item : cartItems) {
      productIdToCartItem.put(item.getProduct().getProductId(), item);
    }

    List<OrderItem> orderItems = new ArrayList<>();
    // Remove item in cart after purchase
    List<CartItem> pendingDeleteCartItems = new ArrayList<>();
    double totalPrice = 0;

    for (var requestCartItem : request.getItems()) {
      if (!productIdToCartItem.containsKey(requestCartItem.getProductId())) {
        // Not allow direct purchase item not in cart
        throw ApiException.builder()
            .message(AppMessage.of(MessageKey.PRODUCT_NOT_IN_CART))
            .status(400)
            .build();
      }
      // Get product price via cart item in database instead of user request
      CartItem cartItemDb = productIdToCartItem.get(requestCartItem.getProductId());
      pendingDeleteCartItems.add(cartItemDb);
      OrderItem orderItem =
          OrderItem.builder()
              .product(cartItemDb.getProduct())
              // .order(order)
              .quantity(requestCartItem.getQuantity())
              .price(cartItemDb.getProduct().getSellPrice())
              .build();
      orderItems.add(orderItem);

      totalPrice += orderItem.getTotalPrice();
    }

    Order order =
        Order.builder()
            .user(user)
            .address(request.getAddress())
            .phone(request.getPhone())
            .totalPrice(totalPrice) // Set price equal 0 as temporary
            // Wait for admin approve order request
            .status(OrderStatus.PENDING)
            .build();

    orderRepository.save(order);

    List<Product> productDecreaseStockLst = new ArrayList<>();
    for (var orderItem : orderItems) {
      orderItem.setOrder(order);
      // After create order, product for this order need to be decrease stock

      Product product = orderItem.getProduct();
      product.setStock(product.getStock() - orderItem.getQuantity());
      productDecreaseStockLst.add(product);
    }
    productRepository.saveAll(productDecreaseStockLst);

    order.setTotalPrice(totalPrice);
    // Create list orderItems for batch insert
    orderItemRepository.saveAll(orderItems);
    // Alternative, change flag to not display in user cart instead delete
    cartRepository.deleteAll(pendingDeleteCartItems);
  }

public List<ProductHistoryDTO> getPurchaseHistory(User user) {
    // Lấy tất cả order của user
    List<Order> orders = orderRepository.findAllByUserId(user.getUserId());

    List<ProductHistoryDTO> history = new ArrayList<>();

    for (Order order : orders) {

        // Mỗi order chứa nhiều OrderItem
        for (OrderItem item : order.getOrderItems()) {

            Product product = item.getProduct();

            history.add(new ProductHistoryDTO(
                product.getProductId(),
                product.getName(),
                product.getType(),
                item.getQuantity(),
                item.getPrice()
            ));
        }
    }

    return history;
}

}



