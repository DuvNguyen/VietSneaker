package com.example.clockee_server.repository;

import com.example.clockee_server.entity.PurchaseItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/** PurchaseItemRepository */
@Repository
public interface PurchaseItemRepository extends JpaRepository<PurchaseItem, Long> {}
