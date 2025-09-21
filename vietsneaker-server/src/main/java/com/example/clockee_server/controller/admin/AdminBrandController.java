package com.example.clockee_server.controller.admin;

import com.example.clockee_server.config.ApplicationConstants;
import com.example.clockee_server.payload.dto.BrandDTO;
import com.example.clockee_server.service.admin.AdminBrandService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping(ApplicationConstants.ADMIN_URL_PREFIX + "/brands")
public class AdminBrandController {
  @Autowired private AdminBrandService adminBrandService;

  @GetMapping
  public ResponseEntity<Page<BrandDTO>> getAllBrands(
      @RequestParam(defaultValue = ApplicationConstants.PAGE_NUMBER) int page,
      @RequestParam(defaultValue = ApplicationConstants.PAGE_SIZE) int size,
      @RequestParam(value = "name", defaultValue = "") String name) {
    return ResponseEntity.ok(adminBrandService.getAllBrands(page, size, name));
  }

  @PostMapping
  @PreAuthorize("hasRole('PRODUCT_ADMIN')")
  public ResponseEntity<BrandDTO> addBrand(@Valid @RequestBody BrandDTO dto) {
    return ResponseEntity.ok(adminBrandService.addBrand(dto));
  }

  @PutMapping("/{id}")
  @PreAuthorize("hasRole('PRODUCT_ADMIN')")
  public ResponseEntity<BrandDTO> updateBrand(
      @PathVariable Long id, @Valid @RequestBody BrandDTO dto) {
    BrandDTO brandDTO = adminBrandService.updateBrand(id, dto);
    return brandDTO != null ? ResponseEntity.ok(brandDTO) : ResponseEntity.notFound().build();
  }

  @DeleteMapping("/{id}")
  @PreAuthorize("hasRole('PRODUCT_ADMIN')")
  public ResponseEntity<Void> deleteBrand(@PathVariable Long id) {
    adminBrandService.deleteBrand(id);
    return ResponseEntity.noContent().build();
  }
}
