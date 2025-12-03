package com.example.vietsneaker_server.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.vietsneaker_server.entity.CartItem;

/** CartRepository */
@Repository
public interface CartRepository extends JpaRepository<CartItem, Long> {

  @Query(
      """
      SELECT cartItem FROM CartItem cartItem
      WHERE cartItem.product.productId = :productId
      AND cartItem.user.userId = :userId
      """)
  Optional<CartItem> findByProductIdAndUserId(
      @Param("productId") Long productId, @Param("userId") Long userId);

  @Query(
      """
      SELECT cartItem FROM CartItem cartItem
      WHERE cartItem.user.userId = :userId
      """)
  List<CartItem> findByUserId(Long userId);
}
