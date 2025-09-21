package com.example.clockee_server.controller.admin;

import com.example.clockee_server.config.ApplicationConstants;
import com.example.clockee_server.payload.dto.SupplierDTO;
import com.example.clockee_server.service.admin.SupplierService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
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
@RequestMapping("/admin/suppliers")
@RequiredArgsConstructor
public class AdminSupplierController {
  @Autowired private SupplierService supplierService;

  // @HasRole(value = "INVENTORY_MANAGER")
  @GetMapping
  public ResponseEntity<Page<SupplierDTO>> getAllSuppliers(
      @RequestParam(defaultValue = ApplicationConstants.PAGE_NUMBER) int page,
      @RequestParam(defaultValue = ApplicationConstants.PAGE_SIZE) int size,
      @RequestParam(value = "name", defaultValue = "") String name) {
    return ResponseEntity.ok(supplierService.getAllSuppliers(page, size, name));
  }

  @PostMapping
  public ResponseEntity<SupplierDTO> addSupplier(@RequestBody SupplierDTO dto) {
    return ResponseEntity.ok(supplierService.addSupplier(dto));
  }

  @PutMapping("/{id}")
  public ResponseEntity<SupplierDTO> updateSupplier(
      @PathVariable Long id, @RequestBody SupplierDTO dto) {
    return ResponseEntity.ok(supplierService.updateSupplier(id, dto));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteSupplier(@PathVariable Long id) {
    supplierService.deletedSupplier(id);
    return ResponseEntity.noContent().build();
  }
}
