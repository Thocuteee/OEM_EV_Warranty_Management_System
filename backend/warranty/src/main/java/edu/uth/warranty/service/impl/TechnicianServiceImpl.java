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
        return technicianRepository.findById(id);
    }

    @Override
    public Technician saveTechnician(TechnicianRequest request) { // SỬA: Nhận TechnicianRequest DTO
        
        // 1. Kiểm tra Center (FK)
        ServiceCenter center = serviceCenterRepository.findById(request.getCenterId()).orElseThrow(() -> new IllegalArgumentException("Trung tâm Dịch vụ không tồn tại."));

        Technician technician;

        if (request.getId() != null) {
            // Logic Cập nhật
            technician = technicianRepository.findById(request.getId()).orElseThrow(() -> new IllegalArgumentException("Hồ sơ Technician không tồn tại."));
        } else {
            // Logic Tạo mới (Chủ yếu từ UserService)
            technician = new Technician();
            
            // 2. Kiểm tra tính duy nhất (Username và Email)
            if (technicianRepository.findByUsername(request.getUsername()).isPresent()) {
                throw new IllegalArgumentException("Tên đăng nhập đã tồn tại.");
            }
            if (technicianRepository.findByEmail(request.getEmail()).isPresent()) {
                throw new IllegalArgumentException("Email đã tồn tại.");
            }
        }
        
        // 3. Ánh xạ dữ liệu từ Request DTO sang Entity Technician
        technician.setTechnicianId(request.getId());
        technician.setCenter(center);
        technician.setName(request.getName());
        technician.setEmail(request.getEmail()); 
        technician.setPhone(request.getPhone());
        technician.setSpecialization(request.getSpecialization());
        technician.setUsername(request.getUsername());
        
        // Mật khẩu (Chủ yếu được User Entity quản lý, nhưng nếu DTO có thì ta lưu)
        if (request.getPassword() != null) {
             technician.setPassword(request.getPassword()); // Giả định là mật khẩu đã hash từ UserService
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
        return technicianRepository.findByUsername(username);
    }
}
