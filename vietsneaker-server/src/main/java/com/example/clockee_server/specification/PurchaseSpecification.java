package com.example.clockee_server.specification;

import com.example.clockee_server.entity.Purchase;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import org.springframework.data.jpa.domain.Specification;

/** PurchaseSpecification */
public class PurchaseSpecification {

  private static LocalDateTime endOfTime(LocalDate date) {
    return date.atTime(LocalTime.MAX);
  }

  public static Specification<Purchase> beforeDate(LocalDate endDate) {
    if (endDate == null) {
      // Default as today
      var today = LocalDate.now();
      return (root, query, builder) ->
          builder.lessThanOrEqualTo(root.get("createdAt"), endOfTime(today));
    }
    return (root, query, builder) ->
        builder.lessThanOrEqualTo(root.get("createdAt"), endOfTime(endDate));
  }

  public static Specification<Purchase> afterDate(LocalDate startDate) {
    if (startDate == null) {
      return null;
    }
    return (root, query, builder) ->
        builder.greaterThanOrEqualTo(root.get("createdAt"), startDate.atStartOfDay());
  }

  public static Specification<Purchase> dateBetween(LocalDate startDate, LocalDate endDate) {
    if (startDate == null && endDate == null) {
      return (root, query, builder) -> builder.conjunction();
    }
    return Specification.allOf(afterDate(startDate), beforeDate(endDate));
  }
}
