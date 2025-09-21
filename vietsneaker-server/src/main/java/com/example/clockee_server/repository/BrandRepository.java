package com.example.clockee_server.repository;

import com.example.clockee_server.entity.Brand;
import com.example.clockee_server.vo.BrandVo;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface BrandRepository
    extends JpaRepository<Brand, Long>, JpaSpecificationExecutor<Brand> {
  Optional<Brand> findById(Long id);

  Page<Brand> findAll(Specification<Brand> spec, Pageable pageable);

//   @Query(
//       value =
//           "SELECT TOP 10 b.name, b.brand_id  ,COUNT(p.product_id) FROM brands AS b INNER JOIN products as p ON  b.brand_id = p.brand_id  GROUP BY b.name, b.brand_id ORDER BY COUNT(b.name) DESC",
//       nativeQuery = true)
//   List<BrandVo> findTopByNumberProduct(@Param("size") int size);
@Query(value = """
    SELECT b.name, b.brand_id, COUNT(p.product_id) AS total_products
    FROM brands b
    INNER JOIN products p ON b.brand_id = p.brand_id
    GROUP BY b.name, b.brand_id
    ORDER BY COUNT(p.product_id) DESC
    LIMIT :size
    """, nativeQuery = true)
List<BrandVo> findTopByNumberProduct(@Param("size") int size);

}
