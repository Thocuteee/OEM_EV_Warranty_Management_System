package edu.uth.warranty.service;

<<<<<<< HEAD
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
=======
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import edu.uth.warranty.model.Part;

@Service
public interface IPartService {

    List<Part> getAllParts();
    Optional<Part> getPartById(Long id);

    // cap nhat hoac xoa
    Part savePart(Part part);
    void deletePart(Long id);

    // nghiep vu
    Optional<Part> getPartByPartNumber(String partNumber);
    List<Part> getPartByName(String name);
    List<Part> findByNameContaining(String name);
    List<Part> getPartByPrice(BigDecimal price);
    List<Part> findByPriceGreaterThan(BigDecimal price);
>>>>>>> 2524f509a70da6fae00d0769f913b1b39a0d5d41
}
