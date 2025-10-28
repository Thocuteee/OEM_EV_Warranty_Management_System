package edu.uth.warranty.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.uth.warranty.model.Invoice;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long>{
    Optional<Invoice> findByInvoice_id(Long invoiceId);

    List<Invoice> findByCenter_id(Long centerId);

    List<Invoice> findByClaim_id(Long claimId);

    List<Invoice> findByLocation(String location);

    List<Invoice> findByQuantity(Integer quantity);

    List<Invoice> findByMinStockLevel(Integer minStockLevel);

    List<Invoice> findByPaymentsStatus(String paymentsStatus);
}
