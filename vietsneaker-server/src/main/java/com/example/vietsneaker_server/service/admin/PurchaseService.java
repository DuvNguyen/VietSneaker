package com.example.vietsneaker_server.service.admin;

import jakarta.transaction.Transactional;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.example.vietsneaker_server.entity.Product;
import com.example.vietsneaker_server.entity.Purchase;
import com.example.vietsneaker_server.entity.PurchaseItem;
import com.example.vietsneaker_server.entity.Supplier;
import com.example.vietsneaker_server.entity.User;
import com.example.vietsneaker_server.exception.ApiException;
import com.example.vietsneaker_server.exception.ResourceNotFoundException;
import com.example.vietsneaker_server.mapper.MapperUtil;
import com.example.vietsneaker_server.mapper.PurchaseMapper;
import com.example.vietsneaker_server.message.AppMessage;
import com.example.vietsneaker_server.message.MessageKey;
import com.example.vietsneaker_server.payload.PageResponse;
import com.example.vietsneaker_server.payload.request.CreatePurchaseRequest;
import com.example.vietsneaker_server.payload.request.PurchaseItemRequest;
import com.example.vietsneaker_server.payload.response.PurchaseDetails;
import com.example.vietsneaker_server.payload.response.PurchaseItemDetails;
import com.example.vietsneaker_server.payload.response.PurchaseResponse;
import com.example.vietsneaker_server.payload.response.PurchaseSummary;
import com.example.vietsneaker_server.repository.ProductRepository;
import com.example.vietsneaker_server.repository.PurchaseRepository;
import com.example.vietsneaker_server.repository.SupplierRepository;
import com.example.vietsneaker_server.specification.PurchaseSpecification;

@Service
@RequiredArgsConstructor
public class PurchaseService {
  private final ProductRepository productRepository;
  private final SupplierRepository supplierRepository;
  private final PurchaseRepository purchaseRepository;
  private final PurchaseMapper purchaseMapper;

  /**
   * Create purchase request pending Product quantity not change yet until change
   *
   * @param autditUser
   */
  public PurchaseResponse create(CreatePurchaseRequest purchaseRequest, User autditUser) {
    if (purchaseRequest.getItems().size() == 0) {
      throw ApiException.builder()
          .message(AppMessage.of(MessageKey.EMPTY_LIST))
          .status(400)
          .build();
    }

    // Fetch products information in batch
    Iterable<Long> productIds =
        purchaseRequest.getItems().stream().map(PurchaseItemRequest::getProductId).toList();
    List<Product> products = productRepository.findAllById(productIds);

    // Migrate to hashmap for fast access
    Map<Long, Product> productIdToProduct = new HashMap<>();
    for (Product product : products) {
      productIdToProduct.put(product.getProductId(), product);
    }

    // Fetch suppliers information in batch
    Iterable<Long> supplierIds =
        purchaseRequest.getItems().stream().map(PurchaseItemRequest::getSupplierId).toList();
    List<Supplier> suppliers = supplierRepository.findAllById(supplierIds);

    // Migrate to hashmap for fast access
    Map<Long, Supplier> supplierIdToSupplier = new HashMap<>();
    for (Supplier supplier : suppliers) {
      supplierIdToSupplier.put(supplier.getSupplierId(), supplier);
    }

    Purchase purchase = Purchase.builder().createdBy(autditUser).build();

    Set<PurchaseItem> purchaseItems =
        MapperUtil.mapSet(
            purchaseRequest.getItems(),
            ((item) -> {
              return PurchaseItem.builder()
                  .product(productIdToProduct.get(item.getProductId()))
                  .supplier(supplierIdToSupplier.get(item.getSupplierId()))
                  .quantity(item.getQuantity())
                  .price(item.getPrice())
                  .purchase(purchase)
                  .build();
            }));
    purchase.setItems(purchaseItems);
    Double totalPrice =
        purchaseItems.stream().mapToDouble((item) -> item.getQuantity() * item.getPrice()).sum();
    purchase.setTotalPrice(totalPrice);

    // Update stock
    for (PurchaseItemRequest item : purchaseRequest.getItems()) {
      Product prod = productIdToProduct.get(item.getProductId());
      Long oldStock = prod.getStock();
      prod.setStock(oldStock + item.getQuantity());
    }
    productRepository.saveAll(productIdToProduct.values());

    // Save will be cascade
    Purchase savedPurchase = purchaseRepository.save(purchase);

    return purchaseMapper.purchaseToResponse(savedPurchase);
  }

  public PageResponse<PurchaseSummary> getPurchaseHistory(
      int page, int size, LocalDate startDate, LocalDate endDate) {
    Specification<Purchase> specification = PurchaseSpecification.dateBetween(startDate, endDate);
    Pageable pageable = PageRequest.of(page, size, Direction.DESC, "createdAt");
    Page<Purchase> purchasePage = purchaseRepository.findAll(specification, pageable);
    return MapperUtil.mapPageResponse(purchasePage, purchaseMapper::purchaseToSummary);
  }

  @Transactional
  public PurchaseDetails getPurchaseDetails(Long purchaseId) {

    Purchase purchase =
        purchaseRepository
            .findById(purchaseId)
            .orElseThrow(() -> new ResourceNotFoundException("purchase"));
    ;

    Set<PurchaseItem> purchaseItems = purchase.getItems();
    Set<PurchaseItemDetails> items =
        purchaseItems.stream().map(purchaseMapper::purchaseToDetails).collect(Collectors.toSet());
    return PurchaseDetails.builder().purchaseId(purchase.getPurchaseId()).items(items).build();
  }
}
