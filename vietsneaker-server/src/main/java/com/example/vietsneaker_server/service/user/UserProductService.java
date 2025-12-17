package com.example.vietsneaker_server.service.user;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.example.vietsneaker_server.entity.Product;
import com.example.vietsneaker_server.exception.ResourceNotFoundException;
import com.example.vietsneaker_server.file.FileStorageService;
import com.example.vietsneaker_server.mapper.MapperUtil;
import com.example.vietsneaker_server.mapper.ProductMapper;
import com.example.vietsneaker_server.message.AppMessage;
import com.example.vietsneaker_server.message.MessageKey;
import com.example.vietsneaker_server.payload.PageResponse;
import com.example.vietsneaker_server.payload.response.ProductDetailsResponse;
import com.example.vietsneaker_server.payload.response.ProductSummaryResponse;
import com.example.vietsneaker_server.repository.ProductRepository;
import com.example.vietsneaker_server.specification.ProductSpecification;
import com.example.vietsneaker_server.vo.BestSellerProductVo;

@Service
@RequiredArgsConstructor
public class UserProductService {
  @Autowired private ProductRepository productRepository;

  @Autowired private ProductMapper productMapper;

  // @Autowired private FileStorageService fileStorageService;

  // Lấy danh sách sản phẩm của user có phân trang
  public Page<ProductSummaryResponse> getAllProducts(
      int page, int size, String name, String type, String shoeSize,
      Double maxPrice, Long brandId, String sortBy) {

    Specification<Product> specification =
        Specification.where(ProductSpecification.searchByName(name))
            .and(ProductSpecification.searchByType(type))
            .and(ProductSpecification.searchByShoeSize(shoeSize))  // add filter by shoe size
            .and(ProductSpecification.searchByBrandId(brandId))
            .and(ProductSpecification.isNotDeleted())
            .and(ProductSpecification.sortBy(sortBy))
            .and(ProductSpecification.belowPrice(maxPrice));

    Pageable pageable = PageRequest.of(page, size);
    Page<Product> products = productRepository.findAll(specification, pageable);

    return products.map(productMapper::productToProductSummary);
  }


  // Lấy sản phẩm theo id
  public ProductDetailsResponse getProductById(Long id) {
    Product product =
        productRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("product"));
    if (product.getIsDeleted()) {
      throw new ResourceNotFoundException("product");
    }
    if (!product.getVisible()) {
      throw new ResourceNotFoundException(AppMessage.of(MessageKey.PRIVATE_PRODUCT));
    }

    return productMapper.productToProductDetails(product);
  }

  // Lay san pham moi nhat
  public PageResponse<ProductSummaryResponse> getLatestProducts(int page, int size) {
    Specification<Product> specification =
        ProductSpecification.isNotDeleted()
            .and(ProductSpecification.isVisiable())
            .and(ProductSpecification.latest());

    Pageable pageable = PageRequest.of(page, size);
    Page<Product> products = productRepository.findAll(specification, pageable);

    return MapperUtil.mapPageResponse(products, productMapper::productToProductSummary);
  }

  // lay san pham ban chay nhat
  public List<ProductSummaryResponse> getBestSellingProducts(int page, int size) {
    List<BestSellerProductVo> products = productRepository.findBestSelling(size);
    return MapperUtil.mapList(
        products,
        (product) -> {
          ProductSummaryResponse productSummary =
              MapperUtil.mapObject(product, ProductSummaryResponse.class);
          productSummary.setImage(product.getImageUrl());
          return productSummary;
        });
    // return MapperUtil.mapPageResponse(products,
    // productMapper::productToProductSummary);
  }
}
