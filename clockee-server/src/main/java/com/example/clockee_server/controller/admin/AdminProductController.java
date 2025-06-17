package com.example.clockee_server.controller.admin;

import com.example.clockee_server.config.ApplicationConstants;
import com.example.clockee_server.payload.request.AdminProductRequest;
import com.example.clockee_server.payload.response.AdminProductResponse;
import com.example.clockee_server.service.admin.AdminProductService;
import io.swagger.v3.oas.annotations.Parameter;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
// Work with page
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/admin/products")
public class AdminProductController {

  @Autowired private AdminProductService adminProductService;

  // Thêm sản phẩm
  @PostMapping
  public ResponseEntity<AdminProductResponse> createProduct(
      @Valid @RequestBody AdminProductRequest request) {
    AdminProductResponse response = adminProductService.createProduct(request);
    return ResponseEntity.status(HttpStatus.CREATED).body(response);
  }

  // Controller - Lấy danh sách sản phẩm có phân trang
  @GetMapping
  public ResponseEntity<Page<AdminProductResponse>> getAllProducts(
      @RequestParam(defaultValue = ApplicationConstants.PAGE_NUMBER) int page,
      @RequestParam(defaultValue = ApplicationConstants.PAGE_SIZE) int size,
      @RequestParam(value = "name", defaultValue = "") String name,
      @RequestParam(value = "sortBy", required = false) String sortProperty,
      @RequestParam(value = "direction", required = false) String sortDirection) {

    Page<AdminProductResponse> products =
        adminProductService.getAllProducts(page, size, name, sortProperty, sortDirection);

    return ResponseEntity.ok(products);
  }

  // Lấy chi tiết sản phẩm theo ID
  @GetMapping("/{id}")
  public ResponseEntity<AdminProductResponse> getProductById(@PathVariable Long id) {
    AdminProductResponse product = adminProductService.getProductById(id);
    return ResponseEntity.ok(product);
  }

  // Cập nhật thông tin sản phẩm
  @PutMapping("/{id}")
  public ResponseEntity<AdminProductResponse> updateProduct(
      @PathVariable Long id, @Valid @RequestBody AdminProductRequest request) {
    AdminProductResponse updatedProduct = adminProductService.updateProduct(id, request);
    return ResponseEntity.ok(updatedProduct);
  }

  // Xoá sản phẩm
  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT) // Không cần trả về nội dung khi xoá thành công
  public void deleteProduct(@PathVariable Long id) {
    adminProductService.deleteProduct(id);
  }

  /**
   * Partial update image for product When create new product image, file not upload in this request
   * but usea separate controller to upload image file for product
   */
  @PostMapping(value = "/image/{productId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ResponseEntity<?> uploadProductImage(
      @PathVariable("productId") Long productId,
      // @Parameter(description = "Image file to upload") @RequestPart("file")
      // MultipartFile file) {
      @Parameter(description = "Image file to upload") @RequestParam("file") MultipartFile file) {
    adminProductService.uploadProductImage(productId, file);
    return ResponseEntity.accepted().build();
  }
}
