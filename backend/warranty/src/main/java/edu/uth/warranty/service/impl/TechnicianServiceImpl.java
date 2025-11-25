package edu.uth.warranty.service.impl;

import edu.uth.warranty.model.Technician;
import edu.uth.warranty.dto.TechnicianRequest;
import edu.uth.warranty.model.ServiceCenter;
import edu.uth.warranty.repository.TechnicianRepository;
import edu.uth.warranty.repository.ServiceCenterRepository;
import edu.uth.warranty.service.ITechnicianService;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.hibernate.Hibernate; // THÊM IMPORT NÀY
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class TechnicianServiceImpl implements ITechnicianService{
    private final TechnicianRepository technicianRepository;
    private final ServiceCenterRepository serviceCenterRepository;
    private final PasswordEncoder passwordEncoder;

    public TechnicianServiceImpl(TechnicianRepository technicianRepository, ServiceCenterRepository serviceCenterRepository, PasswordEncoder passwordEncoder) {
        this.technicianRepository = technicianRepository;
        this.serviceCenterRepository = serviceCenterRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public List<Technician> getAllTechnicians() {
        return technicianRepository.findAll();
    }

    @Override
    public Optional<Technician> getTechnicianById(Long id) {
        return technicianRepository.findByIdWithCenter(id);
    }

    @Override
    public Technician saveTechnician(TechnicianRequest request) { 
        // 1. Kiểm tra Center (FK)
        ServiceCenter center = serviceCenterRepository.findById(request.getCenterId()).orElseThrow(() -> new IllegalArgumentException("Trung tâm Dịch vụ không tồn tại."));

        Technician technician;

        // BƯỚC SỬA: Kiểm tra xem hồ sơ Technician đã tồn tại chưa
        if (request.getId() != null) {
            Optional<Technician> existingTechnicianOpt = technicianRepository.findById(request.getId());

            if (existingTechnicianOpt.isPresent()) {
                // Trường hợp 1: CẬP NHẬT hồ sơ đã có
                technician = existingTechnicianOpt.get();
            } else {
                // Trường hợp 2: TẠO MỚI PROFILE cho User ID đã tồn tại
                technician = new Technician();
                technician.setTechnicianId(request.getId()); // <<< QUAN TRỌNG: Gán ID của User
            }

        } else {
            // Trường hợp 3: Tạo mới hoàn toàn (ID là null)
            technician = new Technician();
            // Áp dụng kiểm tra duy nhất cho TẠO MỚI hoàn toàn
            if (technicianRepository.findByUsername(request.getUsername()).isPresent() || technicianRepository.findByEmail(request.getEmail()).isPresent()) {
                throw new IllegalArgumentException("Username hoặc Email đã tồn tại.");
            }
        }
        
        // 2. Ánh xạ dữ liệu
        technician.setCenter(center);
        technician.setName(request.getName());
        technician.setEmail(request.getEmail()); 
        technician.setPhone(request.getPhone());
        technician.setSpecialization(request.getSpecialization());
        technician.setUsername(request.getUsername());
        
        // 3. Xử lý Mật khẩu
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            if (!request.getPassword().startsWith("$2a$")) {
                technician.setPassword(passwordEncoder.encode(request.getPassword()));
            } else {
                technician.setPassword(request.getPassword());
            }
        }
        
        return technicianRepository.save(technician);
    }

    @Override
    public void deleteTechnician(Long id) {
        technicianRepository.deleteById(id);
    }

    @Override
    public Optional<Technician> getTechnicianByName(String name) {
        return technicianRepository.findByName(name);
    }

    @Override
    public Optional<Technician> getTechnicianByEmail(String email) {
        return technicianRepository.findByEmail(email);
    }

    @Override
    public Optional<Technician> getTechnicianByPhone(String phone) {
        return technicianRepository.findByPhone(phone);
    }

    @Override
    public List<Technician> getTechniciansByCenter(ServiceCenter center) {
        return technicianRepository.findByCenter(center);
    }

    @Override
    public List<Technician> getTechniciansBySpecialization(String specialization) {
        return List.of();
    }

    @Override
    public List<Technician> getTechniciansBySpecializationAndCenter(String specialization, ServiceCenter center) {
        return technicianRepository.findBySpecializationAndCenter(specialization, center);
    }

    @Override
    public Optional<Technician> getTechnicianByUsername(String username) {
        return technicianRepository.findByUsernameWithCenter(username);
    }
}