package com.example.clockee_server.specification;

import ch.qos.logback.core.util.StringUtil;
import com.example.clockee_server.entity.Order;
import com.example.clockee_server.entity.OrderStatus;
import jakarta.persistence.criteria.JoinType;
import org.springframework.data.jpa.domain.Specification;

/** OrderSpecification */
public class OrderSpecification {
  public static Specification<Order> withStatus(OrderStatus status) {
    return (root, query, criteriaBuilder) -> {
      if (status == null || StringUtil.isNullOrEmpty(status.toString())) {
        return criteriaBuilder.conjunction();
      }
      return criteriaBuilder.equal(root.get("status"), status);
    };
  }

  public static Specification<Order> withUserId(Long userId) {
    return (root, query, criteriaBuilder) -> {
      return criteriaBuilder.equal(root.get("user").get("userId"), userId);
    };
  }

  public static Specification<Order> orderByLatest() {
    return (root, query, criteriaBuilder) -> {
      query.orderBy(criteriaBuilder.desc(root.get("createdAt")));
      // Not filter just change order
      return criteriaBuilder.conjunction();
    };
  }

  public static Specification<Order> fetchUsers() {
    return (root, query, criteriaBuilder) -> {
      //  Advoid count query if paginate
      if (Order.class.equals(query.getResultType())) {
        root.fetch("user", JoinType.LEFT);
        // Avoid duplidate collection
        // query.distinct(true);
      }
      return criteriaBuilder.conjunction();
    };
  }
}
