package edu.uth.warranty.controller;

import edu.uth.warranty.model.Technician;
import edu.uth.warranty.model.ServiceCenter;
import edu.uth.warranty.service.ITechnicianService;
import edu.uth.warranty.dto.TechnicianRequest;
import edu.uth.warranty.dto.TechnicianResponse;
import edu.uth.warranty.dto.MessageResponse; 
import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController // REST API
@RequestMapping("/api/technicians")
public class TechnicianController {
    private final ITechnicianService technicianService;

    public TechnicianController(ITechnicianService technicianService) {
        this.technicianService = technicianService;
    }

    private TechnicianResponse toResponseDTO(Technician technician) {
        String centerName = null;
        Long centerId = null;
        
        // FIX LỖI 500: Dựa vào Entity đã được Service tải
        ServiceCenter center = technician.getCenter();
        
        if (center != null) {
            centerId = center.getCenterId();
            centerName = center.getName();
        }
        
        return new TechnicianResponse(
            technician.getTechnicianId(),
            centerId,        
            centerName,      
            technician.getName(),
            technician.getPhone(),
            technician.getEmail(),
            technician.getSpecialization(),
            technician.getUsername()
        ); 
    }

    private Technician toEntity(TechnicianRequest request) {
        Technician technician = new Technician();
        if (request.getId() != null) {
            technician.setTechnicianId(request.getId());
        }
        
        if (request.getCenterId() != null) {
            ServiceCenter serviceCenter = new ServiceCenter();
            serviceCenter.setCenterId(request.getCenterId());
            technician.setCenter(serviceCenter);
        }
        
        technician.setName(request.getName());
        technician.setPhone(request.getPhone());
        technician.setEmail(request.getEmail());
        technician.setSpecialization(request.getSpecialization());
        technician.setUsername(request.getUsername());
        technician.setPassword(request.getPassword());
        
        return technician;
    }

    // 1. POST /api/technicians : Tạo mới Kỹ thuật viên
    @PostMapping
    public ResponseEntity<?> createTechnician(@Valid @RequestBody TechnicianRequest request) {
        try {
            request.setId(null); 
            Technician newTechnician = technicianService.saveTechnician(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(toResponseDTO(newTechnician));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        } catch (Exception e) {
            String errorMessage = "Lỗi hệ thống khi lưu dữ liệu. Vui lòng kiểm tra tính duy nhất của Username/Email/Phone và sự tồn tại của Service Center ID.";
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new MessageResponse(errorMessage));
        }
    }
    
    // 2. GET /api/technicians : Lấy danh sách tất cả Kỹ thuật viên
    @GetMapping
    public ResponseEntity<List<TechnicianResponse>> getAllTechnicians() {
        List<Technician> technicians = technicianService.getAllTechnicians();
        List<TechnicianResponse> responseList = technicians.stream()
            .map(this::toResponseDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(responseList);
    }

    // 3. GET /api/technicians/{id} : Lấy chi tiết Kỹ thuật viên theo ID
    @GetMapping("/{id}")
    public ResponseEntity<TechnicianResponse> getTechnicianById(@PathVariable Long id) {
        Optional<Technician> technician = technicianService.getTechnicianById(id);

        if(technician.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        return ResponseEntity.ok(toResponseDTO(technician.get()));
    }

    // 4. PUT /api/technicians/{id} : Cập nhật Kỹ thuật viên
    @PutMapping("/{id}") 
    public ResponseEntity<?> updateTechnician(@PathVariable Long id, @Valid @RequestBody TechnicianRequest request) {
        request.setId(id);

        if(technicianService.getTechnicianById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        try {
            Technician updatedTechnician = technicianService.saveTechnician(request);
            return ResponseEntity.ok(toResponseDTO(updatedTechnician));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    // 5. DELETE /api/technicians/{id} : Xóa Kỹ thuật viên
    @DeleteMapping("/{id}") 
    public ResponseEntity<Void> deleteTechnician(@PathVariable Long id) {
        if(technicianService.getTechnicianById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        technicianService.deleteTechnician(id);
        return ResponseEntity.noContent().build();
    }
}