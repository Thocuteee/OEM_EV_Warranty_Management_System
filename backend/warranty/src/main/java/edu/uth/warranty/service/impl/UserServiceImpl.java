package edu.uth.warranty.service.impl;

import edu.uth.warranty.model.User;
import edu.uth.warranty.common.Role;
import edu.uth.warranty.repository.StaffRepository;
import edu.uth.warranty.repository.TechnicianRepository;
import edu.uth.warranty.repository.UserRepository;
import edu.uth.warranty.dto.LoginRequest;
import edu.uth.warranty.service.IStaffService;
import edu.uth.warranty.service.ITechnicianService;
import edu.uth.warranty.service.IUserService;

// Import DTOs cần thiết để tạo hồ sơ
import edu.uth.warranty.dto.StaffRequest;
import edu.uth.warranty.dto.TechnicianRequest;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;

import java.util.Optional;
import java.util.List;

@Service
@Transactional
public class UserServiceImpl implements IUserService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final IStaffService staffService;           
    private final ITechnicianService technicianService;  
    private final StaffRepository staffRepository; 
    private final TechnicianRepository technicianRepository;
        
    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder, IStaffService staffService, ITechnicianService technicianService,StaffRepository staffRepository, 
        TechnicianRepository technicianRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.staffService = staffService;
        this.technicianService = technicianService;
        this.staffRepository = staffRepository; 
        this.technicianRepository = technicianRepository;
    }

    @Override
    public Optional<User> authenticateUser(LoginRequest loginRequest) {
        Optional<User> userOpt = Optional.empty();
        String identifier = loginRequest.getUsername();
        
        // Bước 1: Kiểm tra xem identifier có phải là email không
        if (identifier != null && identifier.contains("@")) {
            userOpt = userRepository.findByEmail(identifier);
        }

        // Bước 2: Nếu không phải email hoặc không tìm thấy, thử tìm theo username
        if (userOpt.isEmpty() && identifier != null) {
            userOpt = userRepository.findByUsername(identifier);
        }
        
        // Bước 3: Xác thực mật khẩu
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
                return Optional.of(user);
            }
        }
        return Optional.empty();
    }
    
    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }
    
    @Override
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email); //
    }

    @Override
    public Boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email); //
    }

    // Phương thức lõi để lưu User
    @Override
    public User saveUser(User user) {
        // 1. Kiểm tra tính duy nhất Username
        Optional<User> existingUserByUsername = userRepository.findByUsername(user.getUsername());
        if (existingUserByUsername.isPresent()) {
            if (user.getId() == null || !user.getId().equals(existingUserByUsername.get().getId())) {
                throw new IllegalArgumentException("Username đã tồn tại trong hệ thống.");
            }
        }
        
        // 2. BỔ SUNG KIỂM TRA TÍNH DUY NHẤT EMAIL
        Optional<User> existingUserByEmail = userRepository.findByEmail(user.getEmail());
        if (existingUserByEmail.isPresent()) {
            if (user.getId() == null || !user.getId().equals(existingUserByEmail.get().getId())) {
                throw new IllegalArgumentException("Email đã tồn tại trong hệ thống.");
            }
        }
        
        // 3. Mã hóa mật khẩu
        if(user.getPassword() != null && !user.getPassword().startsWith("$2a$")) { // Sửa lỗi so sánh rỗng
            String hassPassword = passwordEncoder.encode(user.getPassword());
            user.setPassword(hassPassword);
        } else if(user.getId() != null) {
            // Giữ lại mật khẩu cũ nếu là cập nhật và mật khẩu mới là null/rỗng
            User existingUser = userRepository.findById(user.getId()).orElse(null);
            if (existingUser != null) {
                user.setPassword(existingUser.getPassword());
            }
        }
    
        User savedUser = userRepository.save(user);

        // 4. Tự động tạo Profile (chỉ chạy khi là tạo mới)
        if (user.getId() == null) {
            createBusinessProfile(savedUser);
        }

        return savedUser;
    }

    // PHƯƠNG THỨC ĐÃ SỬA: TẠO HỒ SƠ NGHIỆP VỤ TỰ ĐỘNG
    private void createBusinessProfile(User user) {
        Role role = user.getRole();
        Long userId = user.getId();
        
        // Luôn sử dụng Service Center ID 1 (giả định tồn tại)
        Long defaultCenterId = 1L; 

        try {
            // Lấy thông tin cần thiết từ User Entity đã được lưu
            String name = user.getUsername(); 
            String email = user.getEmail();
            String passwordHash = user.getPassword(); // Mật khẩu đã được hash
            
            // TẠO DỮ LIỆU MOCK DUY NHẤT VÀ HỢP LỆ (Quan trọng để tránh lỗi UNIQUE KEY)
            // Phone: Sử dụng 0900 + ID 6 chữ số (để đảm bảo tính duy nhất)
            String uniquePhone = String.format("09%08d", userId); 
            
            String address = "Địa chỉ mặc định"; 
            String specialization = "EV General"; // Chuyên môn mặc định

            
            // 1. Logic cho các vai trò Staff (Admin, EVM_Staff, SC_Staff)
            if (role == Role.SC_Staff || role == Role.EVM_Staff || role == Role.Admin) {
                StaffRequest staffRequest = new StaffRequest();
                staffRequest.setId(userId);
                staffRequest.setCenterId(defaultCenterId);
                staffRequest.setName(name);
                staffRequest.setRole(role);
                staffRequest.setEmail(email);
                staffRequest.setPhone(uniquePhone); // Dùng SĐT duy nhất
                staffRequest.setAddress(address); 
                staffRequest.setUsername(user.getUsername());
                // Truyền HASHED PASSWORD đã có
                staffRequest.setPassword(passwordHash); 
                
                staffService.saveStaff(staffRequest); 
                
            } 
            
            // 2. Logic cho vai trò Technician
            else if (role == Role.SC_Technician) {
                TechnicianRequest technicianRequest = new TechnicianRequest();
                technicianRequest.setId(userId);
                technicianRequest.setCenterId(defaultCenterId);
                technicianRequest.setName(name);
                technicianRequest.setEmail(email);
                technicianRequest.setPhone(uniquePhone); // Dùng SĐT duy nhất
                technicianRequest.setSpecialization(specialization); 
                technicianRequest.setUsername(user.getUsername());
                // Truyền HASHED PASSWORD đã có
                technicianRequest.setPassword(passwordHash); 
                
                technicianService.saveTechnician(technicianRequest); 
            }
            
        } catch (Exception e) {
            String errorMessage = "Lỗi khi tạo hồ sơ nhân sự tự động (Role: " + role.name() + "). Chi tiết: " + e.getMessage();
            throw new IllegalArgumentException(errorMessage);
        }
    }

    


    @Override
    public User registerUser(User user) {
        if (user.getId() != null) {
            throw new IllegalArgumentException("Lỗi đăng ký: User không thể có ID đã tồn tại.");
        }
        
        return saveUser(user);
    }

    @Override
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    @Override
    public List<User> getUsersByRole(Role role) {
        return userRepository.findByRole(role);
    }

    @Override
    public Boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    public void createBusinessProfileIfMissing(User user) {
        // Kiểm tra logic để đảm bảo các trường cần thiết đã có
        if (user.getId() == null) {
             throw new IllegalArgumentException("Không thể tạo Business Profile: User ID không tồn tại.");
        }
        
        Role role = user.getRole();
        // Kiểm tra xem hồ sơ đã tồn tại chưa
        boolean profileExists = false;
        
        if (role == Role.SC_Technician) {
            // Technician cần kiểm tra trong TechnicianRepository
            profileExists = technicianRepository.findById(user.getId()).isPresent();
        } else if (role == Role.SC_Staff || role == Role.EVM_Staff || role == Role.Admin) {
            // Staff/Admin cần kiểm tra trong StaffRepository
            profileExists = staffRepository.findById(user.getId()).isPresent();
        }
        
        if (!profileExists) {
            // Nếu hồ sơ nghiệp vụ bị thiếu, gọi lại logic tạo (đã sửa lỗi Phone/Email duy nhất)
            createBusinessProfile(user);
        }
        // Nếu hồ sơ đã tồn tại, không làm gì cả
    }
}