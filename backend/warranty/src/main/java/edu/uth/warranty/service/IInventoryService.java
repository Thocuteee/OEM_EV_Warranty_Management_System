package edu.uth.warranty.service;

import edu.uth.warranty.model.Inventory;
import edu.uth.warranty.model.Part;
import edu.uth.warranty.model.ServiceCenter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

@Service
public interface IInventoryService {
    List<Inventory> getAllInventoryRecords();
    Optional<Inventory> getInventoryById(Long id);

    Inventory saveInventory(Inventory inventory);
    
    void deleteInventory(Long id);

    Optional<Inventory> getInventoryByPartAndCenter(Part part, ServiceCenter center);

    List<Inventory> getInventoryByPart(Part part);

    List<Inventory> getInventoryByCenter(ServiceCenter center);

    List<Inventory> getInventoryForReStock(BigDecimal amount);

    List<Inventory> getInventoryByInvoiceDateBetween(LocalDate startDate, LocalDate endDate);

}
