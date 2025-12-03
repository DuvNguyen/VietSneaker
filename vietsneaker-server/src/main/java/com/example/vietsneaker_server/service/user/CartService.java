package com.example.vietsneaker_server.service.user;

import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.vietsneaker_server.entity.CartItem;
import com.example.vietsneaker_server.entity.Product;
import com.example.vietsneaker_server.entity.User;
import com.example.vietsneaker_server.exception.ApiException;
import com.example.vietsneaker_server.exception.ResourceNotFoundException;
import com.example.vietsneaker_server.mapper.CartMapper;
import com.example.vietsneaker_server.message.AppMessage;
import com.example.vietsneaker_server.message.MessageKey;
import com.example.vietsneaker_server.payload.request.CartItemRequest;
import com.example.vietsneaker_server.payload.response.CartDetailsResponse;
import com.example.vietsneaker_server.repository.CartRepository;
import com.example.vietsneaker_server.repository.ProductRepository;

/** CartService */
@Service
@Log4j2
@RequiredArgsConstructor
public class CartService {
  private final ProductRepository productRepository;
  private final CartRepository cartRepository;
  private final CartMapper cartMapper;

  /*
   * Create new cart item,
   * Increase cart item quantity if exists in cart
   */
  @Transactional
  public CartItem addProduct(CartItemRequest item, User user) {
    Product product = getOrThrowProduct(item.getProductId());
    // Not allow to put more item than stock on hand

    throwIfOutOfStock(product.getStock(), item.getQuantity());
    var existsCartItem =
        cartRepository.findByProductIdAndUserId(item.getProductId(), user.getUserId());

    // If exists before just update quantity
    if (existsCartItem.isPresent()) {
      // Use uddate controller
      var cartItem = existsCartItem.get();

      Long totalQuantity = cartItem.getQuantity() + item.getQuantity();
      throwIfOutOfStock(totalQuantity, product.getStock());
      cartItem.setQuantity(totalQuantity);
      return cartRepository.save(cartItem);
    } else {
      // Save new cart item
      var cartItem =
          CartItem.builder().product(product).quantity(item.getQuantity()).user(user).build();

      return cartRepository.save(cartItem);
    }
  }

  private void throwIfOutOfStock(Long itemQuantity, Long currentStock) {

    boolean outOfStock = currentStock < currentStock;
    if (outOfStock) {
      throw ApiException.builder().message(AppMessage.of(MessageKey.OUT_OF_STOCK)).build();
    }
  }

  private Product getOrThrowProduct(Long productId) {
    return productRepository
        .findById(productId)
        .orElseThrow(() -> new ResourceNotFoundException("product"));
  }

  private CartItem getOrThrowCartItem(Long productId, Long userId) {
    return cartRepository
        .findByProductIdAndUserId(productId, userId)
        .orElseThrow(() -> new ResourceNotFoundException("cart item"));
  }

  /*
   * Update quantity of item in cart, instead of increase
   */
  @Transactional
  public CartItem updateItem(CartItemRequest item, User user) {
    Product product = getOrThrowProduct(item.getProductId());

    CartItem cartItem = getOrThrowCartItem(item.getProductId(), user.getUserId());

    throwIfOutOfStock(item.getQuantity(), product.getStock());
    cartItem.setQuantity(item.getQuantity());
    return cartRepository.save(cartItem);
  }

  public void removeItem(Long productId, User user) {
    CartItem cartItem = getOrThrowCartItem(productId, user.getUserId());
    cartRepository.delete(cartItem);
  }

  public CartDetailsResponse getAll(User user) {
    // TOOD: Map to DTO
    List<CartItem> items = cartRepository.findByUserId(user.getUserId());
    return cartMapper.cartItemsToDetails(items);
  }
}
