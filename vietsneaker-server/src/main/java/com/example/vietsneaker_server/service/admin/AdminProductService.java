package com.example.vietsneaker_server.service.admin;

import jakarta.transaction.Transactional;
import java.util.Optional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.vietsneaker_server.entity.Brand;
import com.example.vietsneaker_server.entity.Product;
import com.example.vietsneaker_server.exception.ResourceNotFoundException;
import com.example.vietsneaker_server.file.FileStorageService;
import com.example.vietsneaker_server.mapper.ProductMapper;
import com.example.vietsneaker_server.message.AppMessage;
import com.example.vietsneaker_server.message.MessageKey;
import com.example.vietsneaker_server.payload.request.AdminProductRequest;
import com.example.vietsneaker_server.payload.response.AdminProductResponse;
import com.example.vietsneaker_server.repository.BrandRepository;
import com.example.vietsneaker_server.repository.ProductRepository;
import com.example.vietsneaker_server.specification.ProductSpecification;

@Service
public class AdminProductService {
  @Autowired private ProductRepository productRepository;

  @Autowired private BrandRepository brandRepository;

  @Autowired private ModelMapper modelMapper;

  @Autowired private FileStorageService fileStorageService;

  @Autowired private ProductMapper productMapper;

  // add product
  @Transactional
  public AdminProductResponse createProduct(AdminProductRequest request) {
    Product product = modelMapper.map(request, Product.class);

    product.setProductId(null);

    // get Brand from DB and assign for product
    Brand brand =
        brandRepository
            .findById(Long.valueOf(request.getBrandId()))
            .orElseThrow(() -> new RuntimeException("Brand not found!"));
    product.setBrand(brand);

    product.setStock(0L);
    // product.setVersion(0L);
    Product savedProduct = productRepository.save(product);

    // return productMapper.productToAdminResponse(savedProduct);
    return productMapper.productToAdminResponse(savedProduct);
  }

  // get product list with paging
  public Page<AdminProductResponse> getAllProducts(
      int page, int size, String name, String sortProperty, String sortDirection) {
    Specification<Product> specification =
        Specification.where(ProductSpecification.searchByName(name))
            .and(ProductSpecification.isNotDeleted())
            .and(ProductSpecification.sortBy(sortProperty, sortDirection));

    Pageable pageable = PageRequest.of(page, size);

    Page<Product> products = productRepository.findAll(specification, pageable);

    if (products.isEmpty()) {
      return Page.empty();
    }

    return products.map(product -> productMapper.productToAdminResponse(product));
  }

  // get product details with id
  public AdminProductResponse getProductById(Long id) {
    Product product =
        productRepository
            .findById(id)
            .orElseThrow(
                () -> new ResourceNotFoundException(AppMessage.of(MessageKey.RESOURCE_NOT_FOUND)));
    return productMapper.productToAdminResponse(product);
  }

  // update product's detail
  @Transactional
  public AdminProductResponse updateProduct(Long id, AdminProductRequest request) {
    Product product =
        productRepository
            .findById(id)
            .orElseThrow(() -> new RuntimeException("Product does not exist!"));

    Optional<Brand> brand = brandRepository.findById(request.getBrandId());
    if (brand.isPresent()) {
      product.setBrand(brand.get());
    }

    product.setName(request.getName());
    product.setDescription(request.getDescription());
    product.setActualPrice(request.getActualPrice());
    product.setSellPrice(request.getSellPrice());
    product.setType(request.getType());
    product.setIsActive(request.isActive());
    product.setVisible(request.isVisible());

    Product updatedProduct = productRepository.save(product);

    return productMapper.productToAdminResponse(updatedProduct);
  }

  // delete product
  @Transactional
  public AdminProductResponse deleteProduct(Long id) {
    Product product =
        productRepository
            .findById(id)
            .orElseThrow(() -> new RuntimeException("Product not found!"));

    product.setIsDeleted(true);
    productRepository.save(product);
    return productMapper.productToAdminResponse(product);
  }

  /**
   * Upload image file from form request to system file Product image url will be file path to this
   * system file
   */
  public void uploadProductImage(Long productId, MultipartFile file) {
    Product product =
        productRepository
            .findById(productId)
            .orElseThrow(() -> new ResourceNotFoundException("product"));
    String productImageFilePath = fileStorageService.saveFile(file);
    product.setImageUrl(productImageFilePath);
    productRepository.save(product);
  }
}
