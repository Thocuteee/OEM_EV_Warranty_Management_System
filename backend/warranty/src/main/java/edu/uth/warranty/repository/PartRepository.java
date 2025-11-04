package edu.uth.warranty.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import edu.uth.warranty.model.Part;

@Repository
public interface PartRepository {
    Optional<Part> findByPartId(String partId);

    Optional<Part> findByPartNumber(String partNumber);

    List<Part> findByName(String name);
    
    List<Part> findByPrice(java.math.BigDecimal price);

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.uth.warranty.model.Part;


@Repository
public interface PartRepository extends JpaRepository<Part, Long>{
    Optional<Part> findByPartNumber(String partNumber);

    List<Part> findByName(String name);

    List<Part> findByNameContaining(String name);

    List<Part> findByPriceLessThanEqual(BigDecimal price);

    List<Part> findByPriceGreaterThan(BigDecimal price);
}
