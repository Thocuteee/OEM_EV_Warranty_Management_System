package edu.uth.warranty.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable; // Cần để lấy tên/mã part
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping; // Cần để kiểm tra Claim
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import edu.uth.warranty.dto.ClaimPartRequest;
import edu.uth.warranty.dto.ClaimPartResponse;
import edu.uth.warranty.model.ClaimPart;
import edu.uth.warranty.model.Part;
import edu.uth.warranty.model.WarrantyClaim; // Dùng ArrayList thay vì stream cho "bình thường"
import edu.uth.warranty.service.IClaimPartService;
import edu.uth.warranty.service.IPartService;
import edu.uth.warranty.service.IWarrantyClaimService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/claim-parts")
public class ClaimPartController {

    // 1. Tiêm (Inject) các Service cần thiết
    private final IClaimPartService claimPartService;
    private final IPartService partService;
    private final IWarrantyClaimService claimService;

    public ClaimPartController(IClaimPartService claimPartService, IPartService partService, IWarrantyClaimService claimService) {
        this.claimPartService = claimPartService;
        this.partService = partService;
        this.claimService = claimService;
    }

    // 2. Hàm helper chuyển Request DTO -> Entity (để lưu vào DB)
    private ClaimPart toEntity(ClaimPartRequest request) {
        ClaimPart entity = new ClaimPart();

        // Tạo các đối tượng "proxy" cho Khóa Ngoại (FK)
        // JPA chỉ cần ID là hiểu
        if (request.getClaimId() != null) {
            WarrantyClaim claim = new WarrantyClaim();
            claim.setClaimId(request.getClaimId());
            entity.setClaim(claim);
        }

        if (request.getPartId() != null) {
            Part part = new Part();
            part.setPartId(request.getPartId());
            entity.setPart(part);
        }

        // Map các trường dữ liệu còn lại
        entity.setQuantity(request.getQuantity());
        entity.setUnitPrice(request.getUnitPrice());
        entity.setTotalPrice(request.getTotalPrice()); 

        return entity;
    }

    // 3. Hàm helper chuyển Entity -> Response DTO (để trả về FE)
    private ClaimPartResponse toResponseDTO(ClaimPart entity) {
        
        // Lấy thông tin Part (Tên, Mã) để hiển thị cho đẹp
        String partNumber = null;
        String partName = null;
        
        if (entity.getPart() != null && entity.getPart().getPartId() != null) {
            // Gọi service để tìm thông tin linh kiện
            Optional<Part> partOpt = partService.getPartById(entity.getPart().getPartId());
            if (partOpt.isPresent()) {
                partNumber = partOpt.get().getPartNumber();
                partName = partOpt.get().getName();
            }
        }

        // Tạo đối tượng Response
        ClaimPartResponse response = new ClaimPartResponse();
        response.setClaimId(entity.getClaim().getClaimId());
        response.setPartId(entity.getPart().getPartId());
        response.setPartNumber(partNumber);
        response.setPartName(partName);
        response.setQuantity(entity.getQuantity());
        response.setUnitPrice(entity.getUnitPrice());
        response.setTotalPrice(entity.getTotalPrice());
        
        return response;
    }


    //POST /api/claim-parts Thêm một linh kiện vào claim. Service `saveClaimPart` sẽ tự xử lý việc tạo mới hoặc cập nhật
    
    @PostMapping
    public ResponseEntity<ClaimPartResponse> createOrUpdateClaimPart(@Valid @RequestBody ClaimPartRequest request) {
        // Service `saveClaimPart` sẽ kiểm tra FK tồn tại
        ClaimPart newClaimPart = toEntity(request);
        ClaimPart savedClaimPart = claimPartService.saveClaimPart(newClaimPart);
        
        // Chuyển lại DTO để trả về
        ClaimPartResponse response = toResponseDTO(savedClaimPart);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    //GET /api/claim-parts/by-claim/{claimId} Lấy tất cả linh kiện cho một claim cụ thể
    @GetMapping("/by-claim/{claimId}")
    public ResponseEntity<List<ClaimPartResponse>> getPartsByClaimId(@PathVariable Long claimId) {
        // Kiểm tra xem Claim có tồn tại không
        if (claimService.getWarrantyClaimById(claimId).isEmpty()) {
             return ResponseEntity.notFound().build(); // Trả về 404 nếu Claim không có
        }

        // Tạo proxy object để query
        WarrantyClaim claim = new WarrantyClaim();
        claim.setClaimId(claimId);

        List<ClaimPart> list = claimPartService.getClaimPartsByClaim(claim);
        
        // Chuyển danh sách Entity sang Response DTO (cách "bình thường" dùng vòng lặp)
        List<ClaimPartResponse> responseList = new ArrayList<>();
        for (ClaimPart entity : list) {
            responseList.add(toResponseDTO(entity));
        }
        
        return ResponseEntity.ok(responseList);
    }

    //GET /api/claim-parts/find?claimId={...}&partId={...} lấy chi tiết 1 record bằng khóa phức hợp 
    @GetMapping("/find")
    public ResponseEntity<ClaimPartResponse> getClaimPartById(
            @RequestParam Long claimId, 
            @RequestParam Long partId) {
                
        Optional<ClaimPart> entity = claimPartService.getClaimPartById(claimId, partId);

        if (entity.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        return ResponseEntity.ok(toResponseDTO(entity.get()));
    }

    // delete part id 
    @DeleteMapping
    public ResponseEntity<Void> deleteClaimPart(
            @RequestParam Long claimId, 
            @RequestParam Long partId) {
        
        // Kiểm tra tồn tại trước khi xóa
        Optional<ClaimPart> entity = claimPartService.getClaimPartById(claimId, partId);
        if (entity.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        claimPartService.deleteClaimParts(claimId, partId);
        return ResponseEntity.noContent().build(); // Trả về 204 No Content
    }
}
