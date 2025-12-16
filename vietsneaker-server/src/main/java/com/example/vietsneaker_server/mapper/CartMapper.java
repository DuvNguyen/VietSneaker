package com.example.vietsneaker_server.mapper;

import java.util.List;

import lombok.RequiredArgsConstructor;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import com.example.vietsneaker_server.entity.CartItem;
import com.example.vietsneaker_server.payload.request.CartItemRequest;
import com.example.vietsneaker_server.payload.response.CartDetailsResponse;
import com.example.vietsneaker_server.payload.response.CartItemDetails;

@Component
@RequiredArgsConstructor
public class CartMapper {

  private final ModelMapper mapper;

  public CartItemRequest cartItemToDTO(CartItem item) {
    return mapper.map(item, CartItemRequest.class);
  }

  public CartItemDetails cartItemToDetails(CartItem item) {
    return CartItemDetails.builder()
        .productId(item.getProduct().getProductId())
        .name(item.getProduct().getName())
        .price(item.getProduct().getActualPrice())
        .quantity(item.getQuantity())
        .image(item.getProduct().getImageUrl())
        .build();
  }

  public CartDetailsResponse cartItemsToDetails(List<CartItem> items) {

    List<CartItemDetails> itemsDetailsCollection =
        items.stream().map(this::cartItemToDetails).toList();

    Double totalPrice =
        itemsDetailsCollection.stream()
            .mapToDouble(item -> item.getQuantity() * item.getPrice())
            .sum();

    return CartDetailsResponse.builder()
        .items(itemsDetailsCollection)
        .totalPrice(totalPrice)
        .build();
  }
}
