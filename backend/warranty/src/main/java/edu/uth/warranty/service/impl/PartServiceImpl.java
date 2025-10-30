package edu.uth.warranty.service.impl;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.uth.warranty.model.Part;
import edu.uth.warranty.repository.PartRepository;
import edu.uth.warranty.service.IPartService;


@Transactional
@Service
public class PartServiceImpl implements IPartService {

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
    public List<Part> getPartByName(String name) {
        return partRepository.findByName(name);
    }

    @Override
    public List<Part> findByNameContaining(String name) {
        return partRepository.findByNameContaining(name);
    }

    @Override
    public List<Part> getPartByPrice(BigDecimal price) {
        return partRepository.findByPriceLessThanEqual(price);
    }

    @Override
    public List<Part> findByPriceGreaterThan(BigDecimal price) {
        return partRepository.findByPriceGreaterThan(price);
    }
}
