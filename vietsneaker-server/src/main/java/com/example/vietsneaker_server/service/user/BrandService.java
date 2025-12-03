package com.example.vietsneaker_server.service.user;

import jakarta.validation.constraints.NotNull;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.example.vietsneaker_server.entity.Brand;
import com.example.vietsneaker_server.payload.dto.BrandDTO;
import com.example.vietsneaker_server.repository.BrandRepository;
import com.example.vietsneaker_server.specification.BrandSpecification;
import com.example.vietsneaker_server.vo.BrandVo;

/** BrandService */
@Service
@RequiredArgsConstructor
public class BrandService {
  private final BrandRepository brandRepository;

  /** Get list of brand that relate to the most product in application */
  public List<BrandVo> getPopular(int size) {
    List<BrandVo> brands = brandRepository.findTopByNumberProduct(size);
    return brands;
  }

  public Page<BrandDTO> getAllBrands(int page, int size, @NotNull String name) {
    Specification<Brand> specification =
        BrandSpecification.searchByName(name).and(BrandSpecification.isDeleted());

    Pageable pageable = PageRequest.of(page, size);
    return brandRepository
        .findAll(specification, pageable)
        .map(brand -> new BrandDTO(brand.getBrandId(), brand.getName()));
  }
}
