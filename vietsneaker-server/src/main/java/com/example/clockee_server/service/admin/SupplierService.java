package com.example.clockee_server.service.admin;

import com.example.clockee_server.entity.Supplier;
import com.example.clockee_server.payload.dto.SupplierDTO;
import com.example.clockee_server.repository.SupplierRepository;
import com.example.clockee_server.specification.SupplierSpecification;
import jakarta.validation.constraints.NotNull;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SupplierService {
  @Autowired private SupplierRepository supplierRepository;

  public Page<SupplierDTO> getAllSuppliers(int page, int size, @NotNull String name) {
    Pageable pageable = PageRequest.of(page, size);
    Specification<Supplier> specification =
        SupplierSpecification.searchByName(name).and(SupplierSpecification.isDeleted());
    return supplierRepository
        .findAll(specification, pageable)
        .map(
            s ->
                new SupplierDTO(
                    s.getSupplierId(), s.getName(), s.getAddress(), s.getPhone(), s.getEmail()));
  }

  public SupplierDTO addSupplier(SupplierDTO dto) {
    Supplier supplier =
        Supplier.builder()
            .name(dto.getName())
            .address(dto.getAddress())
            .phone(dto.getPhone())
            .email(dto.getEmail())
            .isDeleted(false)
            .build();
    Supplier saved = supplierRepository.save(supplier);
    return new SupplierDTO(
        saved.getSupplierId(),
        saved.getName(),
        saved.getAddress(),
        saved.getPhone(),
        saved.getEmail());
  }

  public SupplierDTO updateSupplier(Long id, SupplierDTO dto) {
    Optional<Supplier> supplierOptional = supplierRepository.findById(id);
    if (supplierOptional.isPresent()) {
      Supplier supplier = supplierOptional.get();
      supplier.setName(dto.getName());
      supplier.setAddress(dto.getAddress());
      supplier.setPhone(dto.getPhone());
      supplier.setEmail(dto.getEmail());
      Supplier supplierUpdated = supplierRepository.save(supplier);
      return new SupplierDTO(
          supplierUpdated.getSupplierId(),
          supplierUpdated.getName(),
          supplierUpdated.getAddress(),
          supplierUpdated.getPhone(),
          supplierUpdated.getEmail());
    }
    throw new RuntimeException("Supplier not found");
  }

  public void deletedSupplier(Long id) {
    Optional<Supplier> supplierOptional = supplierRepository.findById(id);
    supplierOptional.ifPresent(
        sup -> {
          sup.setIsDeleted(true);
          supplierRepository.save(sup);
        });
  }
}
