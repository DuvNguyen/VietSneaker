package com.example.vietsneaker_server.service.admin;

import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.example.vietsneaker_server.entity.Supplier;
import com.example.vietsneaker_server.payload.dto.SupplierDTO;
import com.example.vietsneaker_server.repository.SupplierRepository;
import com.example.vietsneaker_server.specification.SupplierSpecification;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SupplierService {

  @Autowired 
  private SupplierRepository supplierRepository;

  // ---------------------------
  // GET ALL + SEARCH + PAGING
  // ---------------------------
  public Page<SupplierDTO> getAllSuppliers(int page, int size, @NotNull String name) {
      Pageable pageable = PageRequest.of(page, size);
      Specification<Supplier> specification =
              SupplierSpecification.searchByName(name)
                      .and(SupplierSpecification.isDeleted());

      return supplierRepository.findAll(specification, pageable)
              .map(this::convertToDTO);
  }

  // ---------------------------
  // ADD NEW SUPPLIER
  // ---------------------------
  public SupplierDTO addSupplier(SupplierDTO dto) {

      Supplier supplier = Supplier.builder()
              .name(dto.getName())
              .address(dto.getAddress())
              .phone(dto.getPhone())
              .email(dto.getEmail())
              .isDeleted(false)

              // New fields
              .supplierType(dto.getSupplierType())
              .zalo(dto.getZalo())
              .facebook(dto.getFacebook())
              .rating(dto.getRating() != null ? dto.getRating() : 5)
              .totalTransactions(0L)
              .notes(dto.getNotes())
              .build();

      Supplier saved = supplierRepository.save(supplier);
      return convertToDTO(saved);
  }

  // ---------------------------
  // UPDATE SUPPLIER
  // ---------------------------
  public SupplierDTO updateSupplier(Long id, SupplierDTO dto) {
      Optional<Supplier> supplierOptional = supplierRepository.findById(id);

      if (supplierOptional.isEmpty()) {
          throw new RuntimeException("Supplier not found");
      }

      Supplier supplier = supplierOptional.get();

      supplier.setName(dto.getName());
      supplier.setAddress(dto.getAddress());
      supplier.setPhone(dto.getPhone());
      supplier.setEmail(dto.getEmail());

      // New fields
      supplier.setSupplierType(dto.getSupplierType());
      supplier.setZalo(dto.getZalo());
      supplier.setFacebook(dto.getFacebook());
      supplier.setRating(dto.getRating());
      supplier.setNotes(dto.getNotes());

      // totalTransactions không dùng update từ FE

      Supplier updated = supplierRepository.save(supplier);
      return convertToDTO(updated);
  }

  // ---------------------------
  // SOFT DELETE
  // ---------------------------
  public void deletedSupplier(Long id) {
      supplierRepository.findById(id).ifPresent(supplier -> {
          supplier.setIsDeleted(true);
          supplierRepository.save(supplier);
      });
  }

  // ---------------------------
  // CONVERTER
  // ---------------------------
  private SupplierDTO convertToDTO(Supplier s) {
      return SupplierDTO.builder()
              .supplierId(s.getSupplierId())
              .name(s.getName())
              .address(s.getAddress())
              .phone(s.getPhone())
              .email(s.getEmail())

              // New fields
              .supplierType(s.getSupplierType())
              .zalo(s.getZalo())
              .facebook(s.getFacebook())
              .rating(s.getRating())
              .totalTransactions(s.getTotalTransactions())
              .notes(s.getNotes())
              .build();
  }
}
