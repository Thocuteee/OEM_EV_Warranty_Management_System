package edu.uth.warranty.service;

import edu.uth.warranty.model.Invoice;
import edu.uth.warranty.model.WarrantyClaim;
import edu.uth.warranty.model.Part;
import edu.uth.warranty.model.ServiceCenter;

import java.util.List;
import java.util.Optional;

public interface IInvoiceService {

    // Lấy tất cả hóa đơn
    List<Invoice> getAllInvoices();

    // Lấy hóa đơn theo ID
    Optional<Invoice> getInvoiceById(Long id);

    // Lưu hoặc cập nhật hóa đơn (business logic kiểm tra tồn kho)
    Invoice saveInvoice(Invoice invoice);

    // Xóa hóa đơn theo ID
    void deleteInvoice(Long id);

    // Lấy danh sách hóa đơn theo Claim
    List<Invoice> getInvoicesByClaim(WarrantyClaim claim);

    // Lấy danh sách hóa đơn theo Part
    List<Invoice> getInvoicesByPart(Part part);

    // Lấy danh sách hóa đơn theo ServiceCenter
    List<Invoice> getInvoicesByCenter(ServiceCenter center);

    // Lọc hóa đơn theo trạng thái thanh toán
    List<Invoice> getInvoicesByPaymentStatus(String paymentStatus);

    // Lọc hóa đơn có số lượng >= một giá trị nào đó
    List<Invoice> getInvoicesByMinQuantity(Integer minQuantity);

    // Lấy danh sách hóa đơn có tồn kho thấp hơn mức tối thiểu
    List<Invoice> getLowStockInvoices(Integer threshold);

    // Kiểm tra xem hóa đơn có bị thiếu hàng không
    boolean isLowStock(Invoice invoice);
}
