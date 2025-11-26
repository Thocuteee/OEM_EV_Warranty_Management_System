package edu.uth.warranty.controller;

import edu.uth.warranty.dto.MessageResponse;
import edu.uth.warranty.dto.StaffRequest;
import edu.uth.warranty.dto.StaffResponse;
import edu.uth.warranty.model.Staff;
import edu.uth.warranty.model.ServiceCenter;
import edu.uth.warranty.common.Role;
import edu.uth.warranty.service.IStaffService;
import edu.uth.warranty.service.IServiceCenterService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/staffs")
public class StaffController {
    public final  IStaffService staffService;
    public final IServiceCenterService serviceCenterService;

    public StaffController(IStaffService staffService, IServiceCenterService serviceCenterService) {
        this.staffService = staffService;
        this.serviceCenterService = serviceCenterService;
    }

    // Chuyển đổi Entity sang Response DTO (Lấy tên trung tâm)

    private StaffResponse toResponseDTO(Staff staff) {
        String centerName = null;
        Long centerId = null;
        ServiceCenter center = staff.getCenter();
        
        if (center != null) {
            // centerId và centerName đã được tải 
            centerId = center.getCenterId();
            centerName = center.getName();
        }
        return new StaffResponse(
            staff.getStaffId(),
            centerId,
            centerName,
            staff.getName(),
            staff.getRole(),
            staff.getPhone(),
            staff.getEmail(),
            staff.getUsername(),
            staff.getAddress()
        );
    }

    private Staff toEntity(StaffRequest request) {
        Staff staff = new Staff();
        if(request.getId() != null) {
            staff.setStaffId(request.getId());
        }
        
        // Map Khóa Ngoại (ServiceCenter FK)
        if(request.getCenterId() != null) {
            ServiceCenter serviceCenter = new ServiceCenter(request.getCenterId());
            staff.setCenter(serviceCenter);
        }

        staff.setName(request.getName());
        staff.setRole(request.getRole());
        staff.setPhone(request.getPhone());
        staff.setEmail(request.getEmail());
        staff.setAddress(request.getAddress());
        staff.setUsername(request.getUsername());
        staff.setPassword(request.getPassword());
        return staff;

    }


    // 1. POST /api/staffs : Tạo mới Staff
    @PostMapping
    public ResponseEntity<?> createStaff(@Valid @RequestBody StaffRequest request) {
        try {
            Staff newStaff = toEntity(request);
            newStaff.setStaffId(null);
            Staff saveStaff = staffService.saveStaff(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(toResponseDTO(saveStaff));
        } catch(IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }


    // 2. GET /api/staffs : Lấy tất cả Staff
    @GetMapping
    public ResponseEntity<List<StaffResponse>> getAllStaffs() {
        List<Staff> staffs = staffService.getAllStaffs();
        List<StaffResponse> response = staffs.stream().map(this::toResponseDTO).collect(Collectors.toList());
        return ResponseEntity.ok(response);
    } 


    // 3. GET /api/staffs/{id} : Lấy chi tiết Staff
    @GetMapping("/{id}")
    public ResponseEntity<StaffResponse> getStaffById(@PathVariable Long id) {
        Optional<Staff> staff = staffService.getStaffById(id);

        if(staff.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(toResponseDTO(staff.get()));
    }

    // 3b. GET /api/staffs/username/{username} : Lấy chi tiết Staff theo Username (phục vụ trang Profile)
    @GetMapping("/username/{username}")
    public ResponseEntity<StaffResponse> getStaffByUsername(@PathVariable String username) {
        Optional<Staff> staff = staffService.getStaffByUsername(username);

        if (staff.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(toResponseDTO(staff.get()));
    }

    // 4. PUT /api/staffs/{id} : Cập nhật Staff (hoặc tạo mới nếu chưa có profile)
    @PutMapping("/{id}")
    public ResponseEntity<?> updateStaff(@PathVariable Long id,@Valid @RequestBody StaffRequest request) {
        request.setId(id);

        try {
            // Service sẽ tự động tạo mới profile nếu user ID tồn tại nhưng staff profile chưa có
            Staff updadedStaff = staffService.saveStaff(request);
            return ResponseEntity.ok(toResponseDTO(updadedStaff));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    // 5. DELETE /api/staffs/{id} : Xóa Staff
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStaff(@PathVariable Long id) {
        if(staffService.getStaffById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        staffService.deleteStaff(id);
        return ResponseEntity.noContent().build();
    }

    // 6. GET /api/staffs/center/{centerId} : Tìm kiếm theo Trung tâm Dịch vụ
    @GetMapping("/center/{centerId}")
    public ResponseEntity<List<StaffResponse>> getStaffsByCenter(@PathVariable Long centerId) {
        ServiceCenter serviceCenter = new ServiceCenter();
        serviceCenter.setCenterId(centerId);

        List<Staff> staffs = staffService.getStaffsByCenter(serviceCenter);

        List<StaffResponse> response = staffs.stream().map(this::toResponseDTO).collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }


    // 7. GET /api/staffs/role?role={role} : Tìm kiếm theo Vai trò
    @GetMapping("/role")
    public ResponseEntity<List<StaffResponse>> getStaffsByRole(@RequestParam Role role) {
        List<Staff> staffs = staffService.getStaffsByRole(role);
        List<StaffResponse> response = staffs.stream().map(this::toResponseDTO).collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }


}

