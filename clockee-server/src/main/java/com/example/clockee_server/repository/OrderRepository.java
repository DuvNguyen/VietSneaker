package com.example.clockee_server.repository;

import com.example.clockee_server.entity.Order;
import com.example.clockee_server.entity.OrderStatus;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository
    extends JpaRepository<Order, Long>, JpaSpecificationExecutor<Order> {
  @Query(
      "SELECT YEAR(o.createdAt) as year, MONTH(o.createdAt) as month, "
          + "SUM((p.sellPrice - p.actualPrice) * oi.quantity) as revenue "
          + "FROM Order o "
          + "JOIN o.orderItems oi "
          + "JOIN oi.product p "
          + "WHERE o.status = 'SHIPPED' "
          + "GROUP BY YEAR(o.createdAt), MONTH(o.createdAt) "
          + "ORDER BY YEAR(o.createdAt), MONTH(o.createdAt)")
  List<Object[]> getMonthlyRevenue();

  @Query(
      "SELECT COALESCE(SUM((COALESCE(p.sellPrice, 0) - COALESCE(p.actualPrice, 0)) * COALESCE(oi.quantity, 0)), 0) as revenue "
          + "FROM Order o "
          + "JOIN o.orderItems oi "
          + "JOIN oi.product p "
          + "WHERE o.status = 'SHIPPED' "
          + "AND YEAR(o.createdAt) = :year "
          + "AND MONTH(o.createdAt) = :month")
  Optional<Double> getRevenueByMonthAndYear(@Param("year") int year, @Param("month") int month);

  @Query(
      "SELECT SUM(o.totalPrice)"
          + "FROM Order o WHERE o.status = 'SHIPPED' AND YEAR(o.createdAt) = :year "
          + "AND MONTH(o.createdAt) = :month")
  Double sumTotalPriceSale(@Param("year") int year, @Param("month") int month);

  @Query("SELECT COUNT(o) FROM Order o WHERE YEAR(o.createdAt) = :year")
  Long countOrdersByYear(@Param("year") int year);

  @Query("SELECT COUNT(o) FROM Order o WHERE YEAR(o.createdAt) = :year AND o.status = :status")
  Long countOrdersByYearAndStatus(@Param("year") int year, @Param("status") OrderStatus status);

  @Query(
      "SELECT o from Order o JOIN FETCH  o.orderItems WHERE o.orderId = :orderId AND o.user.userId = :userId")
  Optional<Order> findByUserIdAndOrderIdWithItems(
      @Param("userId") Long userId, @Param("orderId") Long orderId);

  // Page<Order> findAll( Specification<Order> specification, Pageable pageable);

}
