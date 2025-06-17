package com.example.clockee_server.controller.user;

import com.example.clockee_server.auth.annotation.CurrentUser;
import com.example.clockee_server.config.ApplicationConstants;
import com.example.clockee_server.entity.User;
import com.example.clockee_server.message.AppMessage;
import com.example.clockee_server.message.MessageKey;
import com.example.clockee_server.payload.request.CartItemRequest;
import com.example.clockee_server.payload.response.CartDetailsResponse;
import com.example.clockee_server.service.user.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** CartController */
@RestController
@RequestMapping(ApplicationConstants.USER_URL_PREFIX + "/cart")
@RequiredArgsConstructor
public class CartController {
  private final CartService cartService;

  @GetMapping
  @PreAuthorize("isAuthenticated()")
  public ResponseEntity<CartDetailsResponse> getAllItems(@CurrentUser User user) {
    return ResponseEntity.ok(cartService.getAll(user));
  }

  @PostMapping("/items")
  public ResponseEntity<?> addItem(
      @Valid @RequestBody CartItemRequest item, @CurrentUser User user) {
    cartService.addProduct(item, user);
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(AppMessage.of(MessageKey.CREATED_SUCCESS));
  }

  @PutMapping("/items")
  public ResponseEntity<?> updateItem(
      @Valid @RequestBody CartItemRequest item, @CurrentUser User user) {
    cartService.updateItem(item, user);
    return ResponseEntity.ok(AppMessage.of(MessageKey.UPDATED_SUCCESS));
  }

  @DeleteMapping("/items/{productId}")
  public ResponseEntity<?> removeItem(@PathVariable Long productId, @CurrentUser User user) {
    cartService.removeItem(productId, user);
    return ResponseEntity.status(HttpStatus.NO_CONTENT)
        .body(AppMessage.of(MessageKey.DELETED_SUCCESS));
  }
}
