package com.example.vietsneaker_server.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.vietsneaker_server.entity.PurchaseItem;

/** PurchaseItemRepository */
@Repository
public interface PurchaseItemRepository extends JpaRepository<PurchaseItem, Long> {}
