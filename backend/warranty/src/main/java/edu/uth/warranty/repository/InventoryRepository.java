package edu.uth.warranty.repository;

import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import edu.uth.warranty.model.Inventory;
import edu.uth.warranty.model.Part;
import edu.uth.warranty.model.ServiceCenter;
import java.math.BigDecimal;
import java.time.LocalDate;

import java.util.Optional;
import java.util.List;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {
    Optional<Inventory> findByInventory_Part_Center(Long inventory , Part part, ServiceCenter center);
    List<Inventory> findByBigDecimal (BigDecimal amount);
    List<Inventory> findByInvoiceDate(LocalDate invoiceDate);

    
}