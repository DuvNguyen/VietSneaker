package com.example.vietsneaker_server.repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.vietsneaker_server.entity.Role;
import com.example.vietsneaker_server.entity.RoleName;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
  Optional<Role> findByRoleName(RoleName rolename);

  Set<Role> findAllByRoleNameIn(List<RoleName> roleNames);
}
