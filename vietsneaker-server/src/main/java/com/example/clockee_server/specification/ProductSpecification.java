package com.example.clockee_server.specification;

import ch.qos.logback.core.util.StringUtil;
import com.example.clockee_server.entity.Product;
import org.springframework.data.jpa.domain.Specification;

/** ProductSpecification */
public class ProductSpecification {

  public static Specification<Product> searchByName(String name) {
    if (StringUtil.isNullOrEmpty(name)) {
      return null;
    }
    return (root, query, builder) -> builder.like(root.get("name"), "%" + name + "%");
  }

  public static Specification<Product> searchByType(String type) {
    type.strip();
    if (StringUtil.isNullOrEmpty(type)) {
      return null;
    }
    return (root, query, builder) -> builder.equal(root.get("type"), type);
  }

  /**
   * StringUtil.isNullOrEmpty(size) → kiểm tra chuỗi rỗng/null
   * root.get("size") → trỏ tới field size trong entity Product
   * builder.equal(...) → tìm chính xác bằng giá trị bạn truyền (ví dụ "42")
   */
  public static Specification<Product> searchByShoeSize(String shoeSize) {
    if (StringUtil.isNullOrEmpty(shoeSize)){
      return null;
    }
    return (root, query, builder) -> builder.like(root.get("size"),"%" +  shoeSize + "%");
  }

  public static Specification<Product> belowPrice(Double maxPrice) {
    if (Double.compare(maxPrice, 0) == 0) {
      return null;
    }
    return (root, query, builder) -> builder.lessThanOrEqualTo(root.get("sellPrice"), maxPrice);
  }

  public static Specification<Product> isNotDeleted() {
    return (root, query, builder) -> builder.isFalse(root.get("isDeleted"));
  }

  public static Specification<Product> latest() {
    return (root, query, criteriaBuilder) -> {
      query.orderBy(criteriaBuilder.desc(root.get("createdAt")));
      // Not filter just change order
      return criteriaBuilder.conjunction();
    };
  }

  public static Specification<Product> isActive() {
    return (root, query, cb) -> cb.isTrue(root.get("isActive"));
  }

  public static Specification<Product> isVisiable() {
    return (root, query, cb) -> cb.isTrue(root.get("visible"));
  }

  public static Specification<Product> sortBy(String sortProperty, String sortDirection) {
    if (sortDirection == null || sortProperty == null) {
      return null;
    }
    return (root, query, criteriaBuilder) -> {
      if ("asc".equalsIgnoreCase(sortDirection)) {
        query.orderBy(criteriaBuilder.asc(root.get(sortProperty)));
      } else if ("desc".equalsIgnoreCase(sortDirection)) {
        query.orderBy(criteriaBuilder.desc(root.get(sortProperty)));
      }
      return criteriaBuilder.conjunction();
    };
  }

  public static Specification<Product> sortBy(String sortQuery) {
    if (StringUtil.isNullOrEmpty(sortQuery)) {
      return null;
    }
    try {
      int separateIndex = sortQuery.indexOf("-");
      if (separateIndex == -1 || separateIndex == sortQuery.length() - 1) {
        return null;
      }

      String sortProperty = sortQuery.substring(0, separateIndex);
      String sortDirection = sortQuery.substring(separateIndex + 1); // skip '-'
      //
      return sortBy(sortProperty, sortDirection);
    } catch (Exception e) {
      return null;
    }
  }

  public static Specification<Product> searchByBrandId(Long brandId) {
    if (brandId == null) {
      return null;
    }
    return (root, query, builder) -> builder.equal(root.get("brand").get("brandId"), brandId);
  }
}
