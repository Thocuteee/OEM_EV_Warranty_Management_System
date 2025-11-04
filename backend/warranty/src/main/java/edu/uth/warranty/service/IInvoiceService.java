package edu.uth.warranty.service;

import edu.uth.warranty.model.Invoice;
import edu.uth.warranty.model.WarrantyClaim;
import edu.uth.warranty.model.Part;
import edu.uth.warranty.model.ServiceCenter;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

@Service
public interface IInvoiceService {
    List<Invoice> getAllInvoices();
    Optional<Invoice> getInvoiceById(Long id);

    Invoice saveInvoice(Invoice invoice);
    
    void deleteInvoice(Long id);

    List<Invoice> getInvoicesByClaim(WarrantyClaim claim);

    List<Invoice> getInvoicesByPart(Part part);

    List<Invoice> getInvoicesByCenter(ServiceCenter center);

    List<Invoice> getInvoicesByPaymentsStatus(String paymentsStatus);
}
