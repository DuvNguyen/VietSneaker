package com.example.clockee_server.entity;

import com.example.clockee_server.util.Client;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import java.util.Set;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "roles")
@Client
public class Role implements GrantedAuthority {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "role_id")
  private Long roleId;

  @Enumerated(EnumType.STRING)
  @Column(name = "role_name", unique = true)
  private RoleName roleName;

  @ManyToMany(mappedBy = "roles")
  @JsonBackReference
  Set<User> users;

  @Override
  public String getAuthority() {
    return "ROLE_" + roleName.getName();
  }
}
