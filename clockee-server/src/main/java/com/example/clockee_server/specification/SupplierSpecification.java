package com.example.clockee_server.specification;

import com.example.clockee_server.entity.Supplier;
import org.springframework.data.jpa.domain.Specification;

/** SupplierSpecification */
public class SupplierSpecification {

  public static Specification<Supplier> searchByName(String name) {
    return (root, query, builder) -> builder.like(root.get("name"), name + "%");
  }

  public static Specification<Supplier> isDeleted() {
    return (root, query, builder) -> builder.isFalse(root.get("isDeleted"));
  }
}
