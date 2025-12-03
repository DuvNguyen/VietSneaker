package com.example.vietsneaker_server.entity;

import com.example.vietsneaker_server.config.ApplicationConstants;
import com.example.vietsneaker_server.util.Client;

import lombok.Getter;

@Client
public enum RoleName {
  CUSTOMER(ApplicationConstants._CUSTOMER),
  PRODUCT_ADMIN(ApplicationConstants._PRODUCT_ADMIN),
  INVENTORY_MANAGER(ApplicationConstants._INVENTORY_MANAGER),
  SYS_ADMIN(ApplicationConstants._SYS_ADMIN);

  @Getter private String name;

  RoleName(String name) {
    this.name = name;
  }
}
