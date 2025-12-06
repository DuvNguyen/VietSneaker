package com.example.vietsneaker_server.specification;

import org.springframework.data.jpa.domain.Specification;

import com.example.vietsneaker_server.entity.Brand;

/** BrandSpecification */
public class BrandSpecification {

  public static Specification<Brand> searchByName(String name) {
    return (root, query, builder) -> builder.like(root.get("name"), name + "%");
  }

  public static Specification<Brand> isDeleted() {
    return (root, query, builder) -> builder.isFalse(root.get("isDeleted"));
  }
}
