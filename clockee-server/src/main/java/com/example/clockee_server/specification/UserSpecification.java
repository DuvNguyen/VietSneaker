package com.example.clockee_server.specification;

import com.example.clockee_server.entity.RoleName;
import com.example.clockee_server.entity.User;
import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

public class UserSpecification {

  public static Specification<User> hasNameLike(String name) {
    return (root, query, builder) -> {
      if (!StringUtils.hasText(name)) {
        return null;
      }
      return builder.like(builder.lower(root.get("name")), "%" + name.toLowerCase() + "%");
    };
  }

  public static Specification<User> hasRole(String roleName) {
    return (root, query, builder) -> {
      if (!StringUtils.hasText(roleName)) {
        return null;
      }

      // Join để truy cập bảng role
      Join<Object, Object> roles = root.join("roles", JoinType.INNER);
      return builder.equal(roles.get("roleName"), RoleName.valueOf(roleName));
    };
  }
}
