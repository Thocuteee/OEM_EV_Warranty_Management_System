package edu.uth.warranty.service.impl;

<<<<<<< HEAD
=======
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

>>>>>>> 2524f509a70da6fae00d0769f913b1b39a0d5d41
import edu.uth.warranty.model.Part;
import edu.uth.warranty.repository.PartRepository;
import edu.uth.warranty.service.IPartService;

<<<<<<< HEAD
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class PartServiceImpl implements IPartService{
    private final PartRepository partRepository;

=======

@Transactional
@Service
public class PartServiceImpl implements IPartService {

    private final PartRepository partRepository;


>>>>>>> 2524f509a70da6fae00d0769f913b1b39a0d5d41
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
<<<<<<< HEAD
        //Kiểm tra tính duy nhất của Part Number (trường core)
        String partNumber = part.getPartNumber();
        Optional<Part> existingPart = partRepository.findByPartNumber(partNumber);
        
        if (existingPart.isPresent()) {
            // Nếu Part Number đã tồn tại, chỉ cho phép cập nhật nếu đó là cùng một bản ghi
            if (part.getPart_id() == null || !part.getPart_id().equals(existingPart.get().getPart_id())) {
                throw new IllegalArgumentException("Mã linh kiện (Part Number) đã tồn tại.");
            }
        }
        
=======
>>>>>>> 2524f509a70da6fae00d0769f913b1b39a0d5d41
        return partRepository.save(part);
    }

    @Override
    public void deletePart(Long id) {
        partRepository.deleteById(id);
    }
<<<<<<< HEAD
=======

>>>>>>> 2524f509a70da6fae00d0769f913b1b39a0d5d41
    
    @Override
    public Optional<Part> getPartByPartNumber(String partNumber) {
        return partRepository.findByPartNumber(partNumber);
    }

    @Override
<<<<<<< HEAD
    public List<Part> getPartsByNameContaining(String name) {
=======
    public List<Part> getPartByName(String name) {
        return partRepository.findByName(name);
    }

    @Override
    public List<Part> findByNameContaining(String name) {
>>>>>>> 2524f509a70da6fae00d0769f913b1b39a0d5d41
        return partRepository.findByNameContaining(name);
    }

    @Override
<<<<<<< HEAD
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
=======
    public List<Part> getPartByPrice(BigDecimal price) {
        return partRepository.findByPriceLessThanEqual(price);
    }

    @Override
    public List<Part> findByPriceGreaterThan(BigDecimal price) {
        return partRepository.findByPriceGreaterThan(price);
>>>>>>> 2524f509a70da6fae00d0769f913b1b39a0d5d41
    }
}
