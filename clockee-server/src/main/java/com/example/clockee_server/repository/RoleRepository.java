package com.example.clockee_server.repository;

import com.example.clockee_server.entity.Role;
import com.example.clockee_server.entity.RoleName;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
  Optional<Role> findByRoleName(RoleName rolename);

  Set<Role> findAllByRoleNameIn(List<RoleName> roleNames);
}
