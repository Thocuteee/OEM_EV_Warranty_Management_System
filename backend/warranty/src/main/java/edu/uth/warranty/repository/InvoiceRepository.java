package edu.uth.warranty.repository;

import edu.uth.warranty.model.Invoice;
import edu.uth.warranty.model.WarrantyClaim;
import edu.uth.warranty.model.Part;
import edu.uth.warranty.model.ServiceCenter;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long>{
    List<Invoice> findByClaim(WarrantyClaim claim);

    List<Invoice> findByPart(Part part);

    List<Invoice> findByCenter(ServiceCenter center);

    List<Invoice> findByPaymentsStatus(String paymentsStatus);

    List<Invoice> findByQuantityGreaterThanEqual(Integer quantity);

    List<Invoice> findByMinStockLevelLessThan(Integer minStockLevel);


}
