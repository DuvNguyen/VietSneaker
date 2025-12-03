package com.example.vietsneaker_server.controller.user;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.vietsneaker_server.config.ApplicationConstants;
import com.example.vietsneaker_server.payload.PageResponse;
import com.example.vietsneaker_server.payload.response.ProductDetailsResponse;
import com.example.vietsneaker_server.payload.response.ProductSummaryResponse;
import com.example.vietsneaker_server.service.user.UserProductService;

@RestController
@RequestMapping("/user/products")
@RequiredArgsConstructor
public class UserProductController {

  @Autowired UserProductService userProductService;

  // Api có phân trang (trả về theo từng trang)
  @GetMapping
  public ResponseEntity<Page<ProductSummaryResponse>> getAllProducts(
      @RequestParam(defaultValue = ApplicationConstants.PAGE_NUMBER) int page,
      @RequestParam(defaultValue = ApplicationConstants.PAGE_SIZE) int size,
      @RequestParam(value = "name", defaultValue = "") String name,
      @RequestParam(value = "type", defaultValue = "") String type,
      @RequestParam(value = "shoeSize", defaultValue = "") String shoeSize,
      @RequestParam(value = "maxPrice", defaultValue = "0") Double maxPrice,
      @RequestParam(value = "brandId", required = false) Long brandId,
      @RequestParam(value = "sortBy", defaultValue = "") String sortBy) {

    Page<ProductSummaryResponse> products =
        userProductService.getAllProducts(page, size, name, type, shoeSize, maxPrice, brandId, sortBy);
    return ResponseEntity.ok(products);
  }

  @GetMapping("/latest")
  public ResponseEntity<PageResponse<ProductSummaryResponse>> getLatestProducts(
      @RequestParam(defaultValue = ApplicationConstants.PAGE_NUMBER) int page,
      @RequestParam(defaultValue = ApplicationConstants.PAGE_SIZE) int size) {
    PageResponse<ProductSummaryResponse> products =
        userProductService.getLatestProducts(page, size);
    return ResponseEntity.ok(products);
  }

  @GetMapping("/best-selling")
  public ResponseEntity<List<ProductSummaryResponse>> getBestSellingProducts(
      @RequestParam(defaultValue = ApplicationConstants.PAGE_NUMBER) int page,
      @RequestParam(defaultValue = ApplicationConstants.PAGE_SIZE) int size) {
    List<ProductSummaryResponse> products = userProductService.getBestSellingProducts(page, size);
    return ResponseEntity.ok(products);
  }

  // Api lấy sản phẩm theo id
  @GetMapping("/{id}")
  public ResponseEntity<ProductDetailsResponse> getProductById(@PathVariable Long id) {
    ProductDetailsResponse product = userProductService.getProductById(id);
    return ResponseEntity.ok(product);
  }
}
