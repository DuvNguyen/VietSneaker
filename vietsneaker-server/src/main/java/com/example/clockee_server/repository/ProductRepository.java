package com.example.clockee_server.repository;

import com.example.clockee_server.entity.Product;
import com.example.clockee_server.vo.BestSellerProductVo;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductRepository
    extends JpaRepository<Product, Long>,
    JpaSpecificationExecutor<Product> { // để kiểu của khóa chính là Long

  List<Product> findTop6BySellPriceLessThanEqualOrderBySellPriceAsc(Double maxPrice);
  
  List<Product> findBySellPriceLessThanEqual(Double price);

  List<Product> findAllByOrderByStockDesc(); // Sắp xếp tồn kho giảm dần

  List<Product> findAllByOrderByStockAsc(); // Sắp xếp tồn kho tăng dần

  @Query("SELECT p FROM Product p WHERE p.isActive = TRUE")
  Page<Product> getAllActiveProducts(Pageable pageable);

  Page<Product> findAll(Specification<Product> specification, Pageable pageable);

  @Query(
      value =
          """
        SELECT
            p.product_id AS productId,
            p.name, 
            p.image_url AS imageUrl,
            p.sell_price AS sellPrice,
            p.type,
            p.is_active AS isActive,
            SUM(oi.quantity) AS totalSold
        FROM products AS p
        JOIN order_items AS oi ON p.product_id = oi.product_id
        WHERE p.is_active = 1
        GROUP BY p.product_id, p.name, p.image_url, p.sell_price, p.type, p.is_active
        ORDER BY totalSold DESC
        LIMIT 12 OFFSET 0;
      """,
      nativeQuery = true)

  List<BestSellerProductVo> findBestSelling(@Param("size") int size);


}
