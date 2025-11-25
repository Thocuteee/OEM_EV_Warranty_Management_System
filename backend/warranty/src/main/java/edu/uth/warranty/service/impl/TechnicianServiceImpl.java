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
import org.hibernate.Hibernate;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class TechnicianServiceImpl implements ITechnicianService{
    private final TechnicianRepository technicianRepository;
    private final ServiceCenterRepository serviceCenterRepository;
    private final PasswordEncoder passwordEncoder;
    
    @PersistenceContext
    private EntityManager entityManager;

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
        Optional<Technician> existingTechnicianOpt = Optional.empty(); // Khai báo ngoài để giữ scope
        boolean isNewProfileWithId = false; // Flag để xác định có phải tạo mới với ID đã set không

        // BƯỚC SỬA: Kiểm tra xem hồ sơ Technician đã tồn tại chưa
        if (request.getId() != null) {
            existingTechnicianOpt = technicianRepository.findById(request.getId());

            if (existingTechnicianOpt.isPresent()) {
                // Trường hợp 1: CẬP NHẬT hồ sơ đã có
                technician = existingTechnicianOpt.get();
            } else {
                // Trường hợp 2: TẠO MỚI PROFILE cho User ID đã tồn tại
                technician = new Technician();
                technician.setTechnicianId(request.getId()); // <<< QUAN TRỌNG: Gán ID của User
                isNewProfileWithId = true; // Đánh dấu là tạo mới với ID đã set
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
                // Mật khẩu đã được hash (từ UserServiceImpl), chỉ gán
                technician.setPassword(request.getPassword());
            }
        } else if (request.getId() != null && !isNewProfileWithId && existingTechnicianOpt.isPresent()) { 
            // KHẮC PHỤC THIẾU: Nếu là cập nhật và không có mật khẩu mới, giữ lại mật khẩu cũ
            technician.setPassword(existingTechnicianOpt.get().getPassword());
        }
        
        // Khi tạo mới với ID đã set, sử dụng native query để insert trực tiếp
        // vì @GeneratedValue sẽ ignore ID đã set khi dùng save() hoặc merge()
        if (isNewProfileWithId) {
            // Sử dụng native query để insert với ID đã set
            String sql = "INSERT INTO Technician (technician_id, center_id, name, phone, email, specialization, username, password) " +
                         "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
            entityManager.createNativeQuery(sql)
                .setParameter(1, technician.getTechnicianId())
                .setParameter(2, technician.getCenter().getCenterId())
                .setParameter(3, technician.getName())
                .setParameter(4, technician.getPhone())
                .setParameter(5, technician.getEmail())
                .setParameter(6, technician.getSpecialization())
                .setParameter(7, technician.getUsername())
                .setParameter(8, technician.getPassword())
                .executeUpdate();
            
            entityManager.flush();
            // Tìm lại entity từ database sau khi insert
            return technicianRepository.findByIdWithCenter(technician.getTechnicianId())
                .orElseThrow(() -> new IllegalStateException("Không thể tìm thấy Technician sau khi tạo mới"));
        } else {
            return technicianRepository.save(technician);
        }
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