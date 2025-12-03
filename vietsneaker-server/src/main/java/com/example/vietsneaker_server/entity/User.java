package com.example.vietsneaker_server.entity;

import com.example.vietsneaker_server.auth.dto.CreateUserRequest;
import com.example.vietsneaker_server.payload.request.CreateLoginRequest;
import com.example.vietsneaker_server.util.ApplicationContextProvider;
import com.example.vietsneaker_server.util.Client;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Nationalized;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;

/** User */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "users")
@Client
public class User implements UserDetails {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "user_id")
  private Long userId;

  @Column(nullable = false, length = 255, unique = true)
  private String email;

  @Column(nullable = false, length = 255)
  private String password;

  @Column(nullable = false, length = 255)
  @Nationalized
  private String name;

  @Column(length = 20)
  private String phone;

  @Column @Nationalized private String address;

  @Builder.Default
  @Column(name = "is_deleted")
  private Boolean isDeleted = false;

  @Column(name = "is_verified")
  private boolean isVerified = false;

  @Column(name = "enabled", nullable = false, columnDefinition = "bit default 1")
  private Boolean enabled;

  @OneToMany(mappedBy = "createdBy")
  @Column
  private List<Purchase> purchases;

  @OneToOne(
      mappedBy = "user",
      fetch = FetchType.LAZY,
      cascade = CascadeType.ALL,
      orphanRemoval = true)
  private VerificationCode verificationCode;

  @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
  @JoinTable(
      name = "roles_users",
      joinColumns = @JoinColumn(name = "user_id"),
      inverseJoinColumns = @JoinColumn(name = "role_id"))
  @JsonManagedReference
  Set<Role> roles;

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return roles;
  }

  public User(CreateUserRequest req) {
    PasswordEncoder passwordEncoder = ApplicationContextProvider.bean(PasswordEncoder.class);
    this.name = req.getName();
    this.email = req.getEmail();
    this.password = passwordEncoder.encode(req.getPassword());
    this.enabled = true;
    this.isDeleted = false;
  }

  public User(CreateLoginRequest req) {
    PasswordEncoder passwordEncoder = ApplicationContextProvider.bean(PasswordEncoder.class);
    this.name = req.getName();
    this.email = req.getEmail();
    this.password = passwordEncoder.encode(req.getPassword());
    this.enabled = true;
    this.isDeleted = false;
  }

  public void updatePassword(String newPassword) {
    PasswordEncoder passwordEncoder = ApplicationContextProvider.bean(PasswordEncoder.class);
    this.password = passwordEncoder.encode(newPassword);
  }

  @Override
  public String getPassword() {
    return password;
  }

  @Override
  public String getUsername() {
    return email;
  }

  @Override
  public boolean isAccountNonExpired() {
    return true;
  }

  @Override
  public boolean isAccountNonLocked() {
    return true;
  }

  @Override
  public boolean isCredentialsNonExpired() {
    return true;
  }

  @Override
  public boolean isEnabled() {
    if (this.enabled == null) {
      // Default value;
      return true;
    }
    return Boolean.TRUE.equals(this.enabled);
  }

  @PrePersist
  public void prePersist() {
    if (enabled == null) {
      enabled = true;
    }
  }

  public List<Long> getRoleIds() {
    if (roles == null) return new ArrayList<>();
    return roles.stream().map(Role::getRoleId).collect(Collectors.toList());
  }

  public void addRole(Role role) {
    this.roles.add(role);
    role.getUsers().add(this);
  }

  public void removeRole(Role role) {
    this.roles.remove(role);
    role.getUsers().remove(this);
  }
}
