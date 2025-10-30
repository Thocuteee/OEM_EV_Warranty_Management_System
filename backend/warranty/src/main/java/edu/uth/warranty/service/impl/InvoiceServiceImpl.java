package edu.uth.warranty.service.impl;

import edu.uth.warranty.model.Invoice;
import edu.uth.warranty.model.WarrantyClaim;
import edu.uth.warranty.model.Part;
import edu.uth.warranty.model.ServiceCenter;
import edu.uth.warranty.repository.InvoiceRepository;
import edu.uth.warranty.service.IInvoiceService;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class InvoiceServiceImpl implements IInvoiceService {

    private final InvoiceRepository invoiceRepository;

    public InvoiceServiceImpl(InvoiceRepository invoiceRepository) {
        this.invoiceRepository = invoiceRepository;
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
        // 💡 Business Logic 1: Kiểm tra tồn kho trước khi lưu
        if (invoice.getQuantity() < 0) {
            throw new IllegalArgumentException("Số lượng không được âm!");
        }

        // 💡 Business Logic 2: Cảnh báo nếu lượng tồn kho thấp hơn mức tối thiểu
        if (invoice.getQuantity() < invoice.getMinStockLevel()) {
            System.out.println("⚠️ Cảnh báo: Lượng hàng tồn thấp hơn mức tối thiểu!");
        }

        // 💡 Business Logic 3: Nếu trạng thái thanh toán trống, đặt mặc định
        if (invoice.getPaymentsStatus() == null || invoice.getPaymentsStatus().isEmpty()) {
            invoice.setPaymentsStatus("PENDING");
        }

        // Lưu vào database
        return invoiceRepository.save(invoice);
    }

    @Override
    public void deleteInvoice(Long id) {
        if (!invoiceRepository.existsById(id)) {
            throw new IllegalArgumentException("Không tìm thấy hóa đơn có ID: " + id);
        }
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
    public List<Invoice> getInvoicesByPaymentStatus(String paymentStatus) {
        return invoiceRepository.findByPaymentsStatus(paymentStatus);
    }

    @Override
    public List<Invoice> getInvoicesByMinQuantity(Integer minQuantity) {
        return invoiceRepository.findByQuantityGreaterThanEqual(minQuantity);
    }

    @Override
    public List<Invoice> getLowStockInvoices(Integer threshold) {
        // Lấy danh sách hóa đơn có lượng tồn kho nhỏ hơn mức tối thiểu
        return invoiceRepository.findByMinStockLevelLessThan(threshold); // người dùng có thể nhập ngưỡng
    }

    @Override
    public boolean isLowStock(Invoice invoice) {
        return invoice.getQuantity() < invoice.getMinStockLevel();
    }
}
