package edu.uth.warranty.service.impl;

import edu.uth.warranty.model.Invoice;
import edu.uth.warranty.model.WarrantyClaim;
import edu.uth.warranty.model.Part;
import edu.uth.warranty.model.ServiceCenter;

import edu.uth.warranty.repository.InvoiceRepository;
import edu.uth.warranty.repository.WarrantyClaimRepository;
import edu.uth.warranty.repository.PartRepository;
import edu.uth.warranty.repository.ServiceCenterRepository;
import edu.uth.warranty.service.IInvoiceService;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class InvoiceServiceImpl implements IInvoiceService{
    private final InvoiceRepository invoiceRepository;
    private final WarrantyClaimRepository claimRepository;
    private final PartRepository partRepository;
    private final ServiceCenterRepository centerRepository;

    public InvoiceServiceImpl(
        InvoiceRepository invoiceRepository,
        WarrantyClaimRepository claimRepository,
        PartRepository partRepository,
        ServiceCenterRepository centerRepository) {
        
        this.invoiceRepository = invoiceRepository;
        this.claimRepository = claimRepository;
        this.partRepository = partRepository;
        this.centerRepository = centerRepository;
    }

    @Override
    public List<Invoice> getAllInvoices() {
        return invoiceRepository.findAll();
    }

    @Override
    public Optional<Invoice> getInvoiceById(Long id) {
        return invoiceRepository.findById(id);
    }

    @Override
    public Invoice saveInvoice(Invoice invoice) {
        //Kiểm tra các Khóa Ngoại (FK) có tồn tại không
        
        // 1. Kiểm tra Claim
        if (invoice.getClaim() == null || invoice.getClaim().getClaimId() == null || 
            claimRepository.findById(invoice.getClaim().getClaimId()).isEmpty()) {
            throw new IllegalArgumentException("Warranty Claim không tồn tại hoặc không hợp lệ.");
        }
        
        // 2. Kiểm tra Part
        if (invoice.getPart() == null || invoice.getPart().getPart_id() == null || 
            partRepository.findById(invoice.getPart().getPart_id()).isEmpty()) {
            throw new IllegalArgumentException("Linh kiện (Part) không tồn tại hoặc không hợp lệ.");
        }

        // 3. Kiểm tra Service Center
        if (invoice.getCenter() == null || invoice.getCenter().getCenterId() == null || 
            centerRepository.findById(invoice.getCenter().getCenterId()).isEmpty()) {
            throw new IllegalArgumentException("Trung tâm Dịch vụ không tồn tại hoặc không hợp lệ.");
        }
        
        // Logic: Có thể thêm logic kiểm tra trạng thái Payments Status là hợp lệ
        
        return invoiceRepository.save(invoice);
    }

    @Override
    public void deleteInvoice(Long id) {
        invoiceRepository.deleteById(id);
    }

    @Override
    public List<Invoice> getInvoicesByClaim(WarrantyClaim claim) {
        return invoiceRepository.findByClaim(claim);
    }

    @Override
    public List<Invoice> getInvoicesByPart(Part part) {
        return invoiceRepository.findByPart(part);
    }

    @Override
    public List<Invoice> getInvoicesByCenter(ServiceCenter center) {
        return invoiceRepository.findByCenter(center);
    }

    @Override
    public List<Invoice> getInvoicesByPaymentsStatus(String paymentsStatus) {
        return invoiceRepository.findByPaymentsStatus(paymentsStatus);
    }
}
