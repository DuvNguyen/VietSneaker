package com.example.vietsneaker_server.controller.admin;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import java.time.LocalDate;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.vietsneaker_server.auth.annotation.CurrentUser;
import com.example.vietsneaker_server.config.ApplicationConstants;
import com.example.vietsneaker_server.entity.User;
import com.example.vietsneaker_server.payload.PageResponse;
import com.example.vietsneaker_server.payload.request.CreatePurchaseRequest;
import com.example.vietsneaker_server.payload.response.PurchaseDetails;
import com.example.vietsneaker_server.payload.response.PurchaseResponse;
import com.example.vietsneaker_server.payload.response.PurchaseSummary;
import com.example.vietsneaker_server.service.admin.PurchaseService;

@RestController
@RequestMapping("/purchase")
@RequiredArgsConstructor
public class AdminPurchaseController {
  private final PurchaseService purchaseService;

  @GetMapping
  public ResponseEntity<PageResponse<PurchaseSummary>> getPurchaseHistory(
      @RequestParam(defaultValue = ApplicationConstants.PAGE_NUMBER) int page,
      @RequestParam(defaultValue = ApplicationConstants.PAGE_SIZE) int size,
      @RequestParam(name = "startDate", required = false) LocalDate startDate,
      @RequestParam(name = "endDate", required = false) LocalDate endDate) {
    var purchaseHistory = purchaseService.getPurchaseHistory(page, size, startDate, endDate);
    return ResponseEntity.ok(purchaseHistory);
  }

  @Operation(
      summary = "Get purchase details",
      description = "Show a list of item assosiate with purchase")
  @GetMapping("/purchase/{purchaseId}")
  public ResponseEntity<PurchaseDetails> getPurchaseDetails(
      @PathVariable("purchaseId") Long purchaseId) {
    PurchaseDetails purchaseDetails = purchaseService.getPurchaseDetails(purchaseId);
    return ResponseEntity.ok(purchaseDetails);
  }

  /** Create purchase on list of product - supplier Rental get more product from supplier */
  @PostMapping
  public ResponseEntity<PurchaseResponse> addPurchase(
      @CurrentUser User autditUser, @Valid @RequestBody CreatePurchaseRequest purchaseRequest) {
    PurchaseResponse response = purchaseService.create(purchaseRequest, autditUser);
    return ResponseEntity.ok(response);
  }
}
