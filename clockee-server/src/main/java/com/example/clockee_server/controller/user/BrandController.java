package com.example.clockee_server.controller.user;

import com.example.clockee_server.config.ApplicationConstants;
import com.example.clockee_server.payload.dto.BrandDTO;
import com.example.clockee_server.service.user.BrandService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/** BrandController */
@RestController
@RequestMapping("/brands")
@RequiredArgsConstructor
public class BrandController {
  private final BrandService brandService;

  @GetMapping("/popular")
  public ResponseEntity<List<?>> getPopularBrand(
      @RequestParam(defaultValue = ApplicationConstants.PAGE_SIZE) int size) {
    var brands = brandService.getPopular(size);
    return ResponseEntity.ok(brands);
  }

  @GetMapping
  public ResponseEntity<Page<BrandDTO>> getAllBrands(
      @RequestParam(defaultValue = ApplicationConstants.PAGE_NUMBER) int page,
      @RequestParam(defaultValue = ApplicationConstants.PAGE_SIZE) int size,
      @RequestParam(value = "name", defaultValue = "") String name) {
    return ResponseEntity.ok(brandService.getAllBrands(page, size, name));
  }
}
