package edu.uth.warranty.controller;


import edu.uth.warranty.model.Technician;
import edu.uth.warranty.service.ITechnicianService;
import jakarta.validation.Valid;

import edu.uth.warranty.dto.TechnicianRequest;
import edu.uth.warranty.dto.TechnicianResponse;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

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

    // Chuyển đổi Entity sang Response DTO
    private TechnicianResponse toResponseDTO(Technician technician) {
        return new TechnicianResponse(
            technician.getTechnician_id(),
            technician.getName(),
            technician.getPhone(),
            technician.getEmail(),
            technician.getSpecialization()
        ); 
    }

    private Technician toEntity(TechnicianRequest request) {
        Technician technician = new Technician();
        if (request.getId() != null) {
            technician.setTechnician_id(request.getId());
        }
        
        technician.setName(request.getName());
        technician.setPhone(request.getPhone());
        technician.setEmail(request.getEmail());
        technician.setSpecialization(request.getSpecialization());
        
        return technician;
    }

    // 1. POST /api/technicians : Tạo mới Kỹ thuật viên
    @PostMapping
    public ResponseEntity<TechnicianResponse> createTechnician(@Valid @RequestBody TechnicianRequest request) {
        Technician newTechnician = toEntity(request);
        Technician saveTechnician = technicianService.saveTechnician(newTechnician);
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponseDTO(saveTechnician));
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
    @GetMapping("/technician/{id}")
    public ResponseEntity<TechnicianResponse> getTechnicianById(@PathVariable Long id) {
        Optional<Technician> technician = technicianService.getTechnicianById(id);

        if(technician.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        return ResponseEntity.ok(toResponseDTO(technician.get()));
    }

    // 4. PUT /api/technicians/{id} : Cập nhật Kỹ thuật viên
   @PutMapping("/technician/{id}")
   public ResponseEntity<TechnicianResponse> updateTechnician(@PathVariable Long id, @RequestBody TechnicianRequest request) {
       request.setId(id);

       if(technicianService.getTechnicianById(id).isEmpty()) {
           return ResponseEntity.notFound().build();
       }

       Technician updatedTechnician = technicianService.saveTechnician(toEntity(request));
       return ResponseEntity.ok(toResponseDTO(updatedTechnician));
   }

    // 5. DELETE /api/technicians/{id} : Xóa Kỹ thuật viên
    @DeleteMapping("/technician/{id}")
    public ResponseEntity<Void> deleteTechnician(@PathVariable Long id) {
        if(technicianService.getTechnicianById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        technicianService.deleteTechnicianById(id);
        return ResponseEntity.noContent().build();
    }
}    

