package edu.uth.warranty.repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.uth.warranty.model.Inventory;
import edu.uth.warranty.model.Part;
import edu.uth.warranty.model.ServiceCenter;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory,Long>{
    List<Inventory> findByPart(Part part);

    List<Inventory> findByCenter(ServiceCenter center);

    Optional<Inventory> findByPartAndCenter(Part part, ServiceCenter center);

    List<Inventory> findByAmountLessThanEqual(BigDecimal amount);

    List<Inventory> findByInvoiceDateBetween(LocalDate startDate, LocalDate endDate);
}

