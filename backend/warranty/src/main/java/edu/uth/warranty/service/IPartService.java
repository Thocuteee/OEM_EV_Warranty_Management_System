package edu.uth.warranty.service;

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
}
