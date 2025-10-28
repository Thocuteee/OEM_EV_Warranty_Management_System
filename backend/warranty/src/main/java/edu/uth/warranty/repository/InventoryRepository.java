package edu.uth.warranty.repository;

import edu.uth.warranty.model.Inventory;
import edu.uth.warranty.model.Part;
import edu.uth.warranty.model.ServiceCenter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;
import java.math.BigDecimal;
import java.time.LocalDate;
@Repository
public interface InventoryRepository extends JpaRepository<Inventory,Long>{
    List<Inventory> findByPartAndCenter(Part part, ServiceCenter center);

    Optional<Inventory> findByInventory_Part_Center(Long inventory , Part part, ServiceCenter center);

    List<Inventory> findByAmount (BigDecimal amount);

    List<Inventory> findByInvoiceDate(LocalDate invoiceDate);
}
