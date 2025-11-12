package edu.uth.warranty.service;

import edu.uth.warranty.model.Part;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

@Service
public interface IPartService {
    List<Part> getAllParts();
    Optional<Part> getPartById(Long id);

    Part savePart(Part part);
    
    void deletePart(Long id);

    Optional<Part> getPartByPartNumber(String partNumber);

    List<Part> getPartsByNameContaining(String name);

    List<Part> getPartsByPriceRange(BigDecimal minPrice, BigDecimal maxPrice);

    Boolean isPartNumberUnique(String partNumber);
}
