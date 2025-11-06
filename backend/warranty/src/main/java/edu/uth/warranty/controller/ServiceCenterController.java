package edu.uth.warranty.controller;

import edu.uth.warranty.dto.CenterRequest;
import edu.uth.warranty.dto.CenterResponse;
import edu.uth.warranty.model.ServiceCenter;
import edu.uth.warranty.service.IServiceCenterService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/centers")
public class ServiceCenterController {
    private final IServiceCenterService serviceCenterService;

    public ServiceCenterController(IServiceCenterService serviceCenterService) {
        this.serviceCenterService = serviceCenterService;
    }


    private CenterResponse toResponseDTO(ServiceCenter center) {
        return new CenterResponse(
            center.getCenterId(), center.getName(), center.getLocation()
        );
    }

    private ServiceCenter toEntity(CenterRequest request) {
        ServiceCenter center = new ServiceCenter();
        // ID chỉ được set khi cập nhật (PUT)
        if(request.getId() != null) {
            center.setCenterId(request.getId());
        }
        center.setName(request.getName());
        center.setLocation(request.getLocation());

        return center;
    }

    // 1. POST /api/centers : Tạo mới Trung tâm Dịch vụ
    @PostMapping
    // SỬA LỖI 1: Thay đổi kiểu trả về thành CenterResponse DTO
    public ResponseEntity<CenterResponse> createCenter(@Valid @RequestBody CenterRequest request) { 
        ServiceCenter newCenter = toEntity(request);
        ServiceCenter saveCenter = serviceCenterService.saveServiceCenter(newCenter);
        // Trả về DTO đã ánh xạ
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponseDTO(saveCenter)); 
    }

    // 2. GET /api/centers : Lấy tất cả Trung tâm Dịch vụ
    @GetMapping
    public ResponseEntity<List<CenterResponse>> getAllCenters() {
        List<ServiceCenter> centers = serviceCenterService.getAllServiceCenters();
        List<CenterResponse> responses = centers.stream().map(this::toResponseDTO).collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    // 3. GET /api/centers/{id} : Lấy chi tiết Trung tâm
    @GetMapping("/{id}")
    public ResponseEntity<CenterResponse> getCenterById(@PathVariable Long id) {
        Optional<ServiceCenter> center = serviceCenterService.getServiceCenterById(id);

        if(center.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(toResponseDTO(center.get()));
    }

    // 4. PUT /api/centers/{id} : Cập nhật Trung tâm
    @PutMapping("/{id}")
    public ResponseEntity<CenterResponse> updateCenters(@PathVariable Long id, @Valid @RequestBody CenterRequest request) {
        request.setId(id);

        if(serviceCenterService.getServiceCenterById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        ServiceCenter updatedCenter = serviceCenterService.saveServiceCenter(toEntity(request));
        return ResponseEntity.ok(toResponseDTO(updatedCenter));
    }

    // 5. DELETE /api/centers/{id} : Xóa Trung tâm
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCenter(@PathVariable Long id) { 
        serviceCenterService.deleteServiceCenter(id); // Gọi Service
        return ResponseEntity.noContent().build();
    }

    // 6. GET /api/centers/search?name={name} : Tìm kiếm theo Tên Trung tâm
    @GetMapping("/search")
    public ResponseEntity<CenterResponse> searchCentersByName(@RequestParam String name) {
        Optional<ServiceCenter> center = serviceCenterService.getServiceCenterByName(name);

        if(center.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(toResponseDTO(center.get()));
    }

    // 7. GET /api/centers/location/{location} : Tìm kiếm theo Vị trí
    @GetMapping("/location/{location}")
    public ResponseEntity<List<CenterResponse>> searchCentersByLocation(@PathVariable String location) {
        List<ServiceCenter> centers = serviceCenterService.getServiceCentersByLocation(location);
        List<CenterResponse> response = centers.stream().map(this::toResponseDTO).collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }
}