package edu.uth.warranty.controller;

import edu.uth.warranty.dto.InvoiceRequest;
import edu.uth.warranty.dto.InvoiceResponse;
import edu.uth.warranty.dto.MessageResponse;
import edu.uth.warranty.model.Invoice;
import edu.uth.warranty.model.Part;
import edu.uth.warranty.model.ServiceCenter;
import edu.uth.warranty.model.WarrantyClaim;
import edu.uth.warranty.service.IInvoiceService;
import edu.uth.warranty.service.IPartService; 
import edu.uth.warranty.service.IServiceCenterService; 

import org.springframework.http.HttpStatus; 
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/invoices")
public class InvoiceController {
    private final IInvoiceService invoiceService;
    private final IPartService partService;
    private final IServiceCenterService serviceCenterService;

    public InvoiceController(IInvoiceService invoiceService, IPartService partService, IServiceCenterService serviceCenterService) {
        this.invoiceService = invoiceService;
        this.partService = partService;
        this.serviceCenterService = serviceCenterService;
    }

    private InvoiceResponse toResponseDTO(Invoice entity) {
        String partName = null;
        String centerName = null;

        if(entity.getPart() != null && entity.getPart().getPartId() != null) {
            Optional<Part> partOpt = partService.getPartById(entity.getPart().getPartId());
            if(partOpt.isPresent()) { 
                partName = partOpt.get().getName();
            }
        }

        if(entity.getCenter() != null && entity.getCenter().getCenterId() != null) {
            Optional<ServiceCenter> centerOpt = serviceCenterService.getServiceCenterById(entity.getCenter().getCenterId());
            if(centerOpt.isPresent()) {
                centerName = centerOpt.get().getName();
            }
        }

        return new InvoiceResponse(
            entity.getInvoiceId(),
            entity.getClaim() != null ? entity.getClaim().getClaimId() : null,
            entity.getPart() != null ? entity.getPart().getPartId() : null,
            partName,
            entity.getCenter() != null ? entity.getCenter().getCenterId() : null,
            centerName,
            entity.getLocationType(),
                entity.getQuantity(),
                entity.getMinStockLevel(),
                entity.getPaymentsStatus()
        );
    }

    private Invoice toEntity(InvoiceRequest request) {
        Invoice entity = new Invoice();

        if(request.getId() != null) {
            entity.setInvoiceId(request.getId());
        }

        if(request.getClaimId() != null) {
            entity.setClaim(new WarrantyClaim(request.getClaimId()));
        }

        if (request.getPartId() != null) {
            Part part = new Part();
            part.setPartId(request.getPartId());
            entity.setPart(part);
        }

        if (request.getCenterId() != null) {
            entity.setCenter(new ServiceCenter(request.getCenterId()));
        }

        entity.setLocationType(request.getLocationType());
        entity.setQuantity(request.getQuantity());
        entity.setMinStockLevel(request.getMinStockLevel());
        entity.setPaymentsStatus(request.getPaymentsStatus());
        
        return entity;
    }

    // 1. POST /api/invoices : Tạo mới Hóa đơn
    @PostMapping
    public ResponseEntity<?> createInvoice(@Valid @RequestBody InvoiceRequest request) {
        try {
            Invoice entity = toEntity(request);
            entity.setInvoiceId(null);
            Invoice saved = invoiceService.saveInvoice(entity);
            return ResponseEntity.status(HttpStatus.CREATED).body(toResponseDTO(saved));
        } catch(IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    // 2. GET /api/invoices : Lấy tất cả Hóa đơn
    @GetMapping
    public ResponseEntity<List<InvoiceResponse>> getAllInvoice() {
        List<InvoiceResponse> responses = invoiceService.getAllInvoices().stream().map(this::toResponseDTO).collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    // 3. GET /api/invoices/{id} : Lấy chi tiết Hóa đơn
    @GetMapping("/{id}")
    public ResponseEntity<InvoiceResponse> getInvoiceById(@PathVariable Long id) {
        Optional<Invoice> invoiceOpt = invoiceService.getInvoiceById(id);

        if(invoiceOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(toResponseDTO(invoiceOpt.get()));
    }

    // 4. PUT /api/invoices/{id} : Cập nhật Hóa đơn
    @PutMapping("/{id}")
    public ResponseEntity<?> updateInvoice(@PathVariable Long id, @Valid @RequestBody InvoiceRequest request) {
        request.setId(id);

        if(invoiceService.getInvoiceById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        } try {
            Invoice entity = toEntity(request);
            Invoice updated = invoiceService.saveInvoice(entity);
            return ResponseEntity.ok(toResponseDTO(updated));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    // 5. DELETE /api/invoices/{id} : Xóa Hóa đơn
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInvoice(@PathVariable Long id) {
        if (invoiceService.getInvoiceById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        invoiceService.deleteInvoice(id);
        return ResponseEntity.noContent().build();
    }

    // 6. GET /api/invoices/search/claim/{claimId} : Tìm kiếm theo Claim
    @GetMapping("/search/claim/{claimId}")
    public ResponseEntity<List<InvoiceResponse>> getInvoicesByClaim(@PathVariable Long claimId) {
        WarrantyClaim claim = new WarrantyClaim();
        claim.setClaimId(claimId);

        List<InvoiceResponse> responses = invoiceService.getInvoicesByClaim(claim).stream().map(this::toResponseDTO).collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    // 7. GET /api/invoices/search/center/{centerId} : Tìm kiếm theo Trung tâm Dịch vụ
    @GetMapping("/search/center/{centerId}")
    public ResponseEntity<List<InvoiceResponse>> getInvoicesByCenter(@PathVariable Long centerId) {
        ServiceCenter center = new ServiceCenter();
        center.setCenterId(centerId);
        
        List<InvoiceResponse> responses = invoiceService.getInvoicesByCenter(center).stream().map(this::toResponseDTO).collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    // 8. GET /api/invoices/search/status?paymentsStatus={status} : Tìm kiếm theo Trạng thái Thanh toán
    @GetMapping("/search/status")
    public ResponseEntity<List<InvoiceResponse>> getInvoicesByPaymentsStatus(@RequestParam String paymentsStatus) {
        List<InvoiceResponse> responses = invoiceService.getInvoicesByPaymentsStatus(paymentsStatus).stream().map(this::toResponseDTO).collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }
}
