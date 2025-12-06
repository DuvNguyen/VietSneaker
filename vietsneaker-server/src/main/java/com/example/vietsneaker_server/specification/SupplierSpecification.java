package com.example.vietsneaker_server.specification;

import org.springframework.data.jpa.domain.Specification;

import com.example.vietsneaker_server.entity.Supplier;

/** SupplierSpecification */
public class SupplierSpecification {

  public static Specification<Supplier> searchByName(String name) {
    return (root, query, builder) -> builder.like(root.get("name"), name + "%");
  }

  public static Specification<Supplier> isDeleted() {
    return (root, query, builder) -> builder.isFalse(root.get("isDeleted"));
  }
}
