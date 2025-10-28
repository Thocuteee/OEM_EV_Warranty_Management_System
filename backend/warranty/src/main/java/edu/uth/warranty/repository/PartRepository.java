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

}
