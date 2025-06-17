package com.example.clockee_server.mapper;

import com.example.clockee_server.entity.Purchase;
import com.example.clockee_server.entity.PurchaseItem;
import com.example.clockee_server.file.FileStorageService;
import com.example.clockee_server.payload.response.PurchaseItemDetails;
import com.example.clockee_server.payload.response.PurchaseItemResponse;
import com.example.clockee_server.payload.response.PurchaseResponse;
import com.example.clockee_server.payload.response.PurchaseSummary;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

/** PurchaseMapper */
@Service
@RequiredArgsConstructor
public class PurchaseMapper {
  private final ModelMapper mapper;
  private final FileStorageService fileStorageService;

  public PurchaseItemResponse purchaseItemToResponse(PurchaseItem item) {
    PurchaseItemResponse destItem = mapper.map(item, PurchaseItemResponse.class);
    destItem.setProductId(item.getProduct().getProductId());
    destItem.setSupplierId(item.getSupplier().getSupplierId());
    return destItem;
  }

  public PurchaseResponse purchaseToResponse(Purchase purchase) {
    PurchaseResponse response = MapperUtil.mapObject(purchase, PurchaseResponse.class);
    response.setItems(MapperUtil.mapSet(purchase.getItems(), this::purchaseItemToResponse));
    return response;
  }

  public PurchaseSummary purchaseToSummary(Purchase purchase) {
    PurchaseSummary response = MapperUtil.mapObject(purchase, PurchaseSummary.class);
    response.setCreatedByUsername(purchase.getCreatedBy().getName());
    return response;
  }

  public PurchaseItemDetails purchaseToDetails(PurchaseItem item) {
    var itemDetails = MapperUtil.mapObject(item, PurchaseItemDetails.class);
    itemDetails.setProductName(item.getProduct().getName());
    itemDetails.setProductImage(
        fileStorageService.readFileFromLocation(item.getProduct().getImageUrl()));
    itemDetails.setSupplierName(item.getSupplier().getName());
    return itemDetails;
  }
}
