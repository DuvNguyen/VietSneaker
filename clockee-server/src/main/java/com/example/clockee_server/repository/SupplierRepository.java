package com.example.clockee_server.repository;

import com.example.clockee_server.entity.Supplier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface SupplierRepository
    extends JpaRepository<Supplier, Long>, JpaSpecificationExecutor<Supplier> {
  Page<Supplier> findAll(Specification<Supplier> spec, Pageable pageable);
}
