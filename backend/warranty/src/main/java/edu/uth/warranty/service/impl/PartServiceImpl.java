package edu.uth.warranty.service.impl;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import edu.uth.warranty.model.Part;
import edu.uth.warranty.repository.PartRepository;
import edu.uth.warranty.service.IPartService;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class PartServiceImpl implements IPartService{
    private final PartRepository partRepository;

    public PartServiceImpl(PartRepository partRepository) {
        this.partRepository = partRepository;
    }

    @Override
    public List<Part> getAllParts() {
        return partRepository.findAll();
    }

    @Override
    public Optional<Part> getPartById(Long id) {
        return partRepository.findById(id);
    }

    @Override
    public Part savePart(Part part) {
        //Kiểm tra tính duy nhất của Part Number (trường core)
        String partNumber = part.getPartNumber();
        Optional<Part> existingPart = partRepository.findByPartNumber(partNumber);
        
        if (existingPart.isPresent()) {
            // Nếu Part Number đã tồn tại, chỉ cho phép cập nhật nếu đó là cùng một bản ghi
            if (part.getPart_id() == null || !part.getPart_id().equals(existingPart.get().getPart_id())) {
                throw new IllegalArgumentException("Mã linh kiện (Part Number) đã tồn tại.");
            }
        }
        
        return partRepository.save(part);
    }

    @Override
    public void deletePart(Long id) {
        partRepository.deleteById(id);
    }
    
    @Override
    public Optional<Part> getPartByPartNumber(String partNumber) {
        return partRepository.findByPartNumber(partNumber);
    }

    @Override
    public List<Part> getPartsByNameContaining(String name) {
        return partRepository.findByNameContaining(name);
    }

    @Override
    public List<Part> getPartsByPriceRange(BigDecimal minPrice, BigDecimal maxPrice) {
        // Sử dụng hai phương thức của Repository để tạo range check
        if (minPrice == null && maxPrice == null) {
            return partRepository.findAll();
        }
        if (minPrice == null) {
            return partRepository.findByPriceLessThanEqual(maxPrice);
        }
        if (maxPrice == null) {
            return partRepository.findByPriceGreaterThan(minPrice);
        }
        return partRepository.findByPriceGreaterThan(minPrice).stream().filter(p -> p.getPrice().compareTo(maxPrice) <= 0).toList();
    }

    @Override
    public Boolean isPartNumberUnique(String partNumber) {
        return partRepository.findByPartNumber(partNumber).isEmpty();
    }
}
