package com.example.vietsneaker_server.service.admin;

import jakarta.validation.constraints.NotNull;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.example.vietsneaker_server.entity.Brand;
import com.example.vietsneaker_server.payload.dto.BrandDTO;
import com.example.vietsneaker_server.repository.BrandRepository;
import com.example.vietsneaker_server.specification.BrandSpecification;

@Service
@RequiredArgsConstructor
public class AdminBrandService {
  @Autowired private BrandRepository brandRepository;

  public Page<BrandDTO> getAllBrands(int page, int size, @NotNull String name) {
    Specification<Brand> specification =
        BrandSpecification.searchByName(name).and(BrandSpecification.isDeleted());

    Pageable pageable = PageRequest.of(page, size);
    return brandRepository
        .findAll(specification, pageable)
        .map(brand -> new BrandDTO(brand.getBrandId(), brand.getName()));
  }

  public BrandDTO addBrand(BrandDTO dto) {
    Brand brand = Brand.builder().name(dto.getName()).isDeleted(false).build();
    return new BrandDTO(brandRepository.save(brand).getBrandId(), brand.getName());
  }

  public BrandDTO updateBrand(Long id, BrandDTO dto) {
    Optional<Brand> brandOptional = brandRepository.findById(id);
    if (brandOptional.isPresent()) {
      Brand brand = brandOptional.get();
      brand.setName(dto.getName());
      brandRepository.save(brand);
      return new BrandDTO(brand.getBrandId(), brand.getName());
    }
    throw new RuntimeException("Brand not found");
  }

  public void deleteBrand(Long id) {
    Optional<Brand> brandOptional = brandRepository.findById(id);
    if (brandOptional.isPresent()) {
      Brand brand = brandOptional.get();
      brand.setIsDeleted(true);
      brandRepository.save(brand);
    }
  }
}
