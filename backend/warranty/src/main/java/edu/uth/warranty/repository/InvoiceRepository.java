package edu.uth.warranty.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.uth.warranty.model.Invoice;
import edu.uth.warranty.model.Part;
import edu.uth.warranty.model.ServiceCenter;
import edu.uth.warranty.model.WarrantyClaim;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long>{
    List<Invoice> findByClaim(WarrantyClaim claim);

    List<Invoice> findByPart(Part part);

    List<Invoice> findByCenter(ServiceCenter center);

    List<Invoice> findByPaymentsStatus(String paymentsStatus);

    List<Invoice> findByQuantityGreaterThanEqual(Integer quantity);

    List<Invoice> findByMinStockLevelLessThan(Integer minStockLevel);


    List<Invoice> findByClaim_id(Long claimId);

    List<Invoice> findByLocation(String location);

    List<Invoice> findByQuantity(Integer quantity);

    List<Invoice> findByMinStockLevel(Integer minStockLevel);

    
}
