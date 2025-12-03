package com.example.vietsneaker_server.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.example.vietsneaker_server.entity.Purchase;

@Repository
public interface PurchaseRepository
    extends JpaRepository<Purchase, Long>, JpaSpecificationExecutor<Purchase> {
  // @Query(
  // "SELECT SUM(p.totalPrice)"
  // + "FROM PurchaseItem p WHERE YEAR(p.createdAt) = :year "
  // + "AND MONTH(p.createdAt) = :month")
  // Double totalPricePurchase(@Param("year") int year, @Param("month") int
  // month);
}
