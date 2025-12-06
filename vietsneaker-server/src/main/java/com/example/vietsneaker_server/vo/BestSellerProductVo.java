package com.example.vietsneaker_server.vo;

/** BestSellerProductVo */
public interface BestSellerProductVo {
  Long getProductId();

  String getName();

  String getImageUrl();

  Double getSellPrice();

  String getType();

  Boolean getIsActive();

  Integer getTotalSold();
}
