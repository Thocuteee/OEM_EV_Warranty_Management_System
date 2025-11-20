package edu.uth.warranty.service.impl;

import edu.uth.warranty.model.User;
import edu.uth.warranty.common.Role;
import edu.uth.warranty.repository.UserRepository;
import edu.uth.warranty.dto.LoginRequest;
import edu.uth.warranty.dto.StaffRequest;
import edu.uth.warranty.dto.TechnicianRequest;
import edu.uth.warranty.service.IStaffService;
import edu.uth.warranty.service.ITechnicianService;
import edu.uth.warranty.service.IUserService;


import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.List;

@Service
@Transactional
public class UserServiceImpl implements IUserService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final IStaffService staffService;          
    private final ITechnicianService technicianService;
        
    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder, IStaffService staffService, ITechnicianService technicianService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.staffService = staffService;
        this.technicianService = technicianService;
    }

    @Override
    public Optional<User> authenticateUser(LoginRequest loginRequest) {
        Optional<User> userOpt = userRepository.findByUsername(loginRequest.getUsername());
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            // So sánh mật khẩu đầu vào (chưa mã hóa) với mật khẩu đã mã hóa trong DB
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

    // Triển khai Tạo/Cập nhật User: Đảm bảo mật khẩu được mã hóa trước khi lưu.
    @Override
    public User saveUser(User user) {
        // 1. Kiểm tra tính duy nhất (chỉ áp dụng cho tạo mới hoặc nếu username bị thay đổi)
        Optional<User> existingUser = userRepository.findByUsername(user.getUsername());
        if (existingUser.isPresent()) {
            // Nếu Username đã tồn tại, chỉ cho phép cập nhật nếu đó là cùng một bản ghi
            if (user.getId() == null || !user.getId().equals(existingUser.get().getId())) {
                throw new IllegalArgumentException("Username đã tồn tại trong hệ thống.");
            }
        }
        
        // 2. Mã hóa mật khẩu nếu nó được cung cấp và KHÔNG rỗng
        // [Lưu ý: Mật khẩu luôn được cung cấp trong RegisterRequest và UserRequest]
        if (user.getPassword() != null && !user.getPassword().isEmpty() && !user.getPassword().startsWith("$2a$")) { 
            // Kiểm tra thêm: nếu nó chưa được mã hóa (bắt đầu bằng $2a$ là đã mã hóa)
            String hashedPassword = passwordEncoder.encode(user.getPassword());
            user.setPassword(hashedPassword);
        }

        User savedUser = userRepository.save(user);

        // 3. TỰ ĐỘNG TẠO PROFILE NGHIỆP VỤ NẾU LÀ TẠO MỚI (chưa có ID)
        if (user.getId() == null) {
            createBusinessProfile(savedUser);
        }
    
        return savedUser;
    }

    private void createBusinessProfile(User user) {
        Role role = user.getRole();
        Long userId = user.getId();

        // Giả định: Mọi nhân viên mới đều thuộc Service Center ID 1 (Mặc định)
        Long defaultCenterId = 1L;

        try {
            String name = user.getUsername();
            String username = user.getUsername() + "@default.com";
            String phone = "090000" + userId;
            String password = user.getPassword(); // Password đã được hash

            if(role == Role.SC_Staff || role == Role.EVM_Staff || role == Role.Admin) {
                StaffRequest staffRequest = new StaffRequest();

                // Set các trường bắt buộc (Sử dụng User ID làm ID hồ sơ nghiệp vụ)
                staffRequest.setId(userId);
                staffRequest.setCenterId(defaultCenterId);
                staffRequest.setName(name);
                staffRequest.setRole(role);
                staffRequest.setEmail(email);
                staffRequest.setPhone(phone);
                staffRequest.setUsername(user.getUsername());
                staffRequest.setPassword(password); // Password đã hash

                staffService.saveStaff(staffRequest);

            } else if(role == Role.SC_Technician) {
                TechnicianRequest technicianRequest = new TechnicianRequest();

                technicianRequest.setId(userId);
                technicianRequest.setCenterId(defaultCenterId);
                technicianRequest.setName(name);
                technicianRequest.setEmail(email);
                technicianRequest.setPhone(phone);
                technicianRequest.setSpecialization("EV General");
                technicianRequest.setUsername(user.getUsername());
                technicianRequest.setPassword(password); // Password đã hash
                
                technicianService.saveTechnician(technicianRequest);
            }
        } catch(Exception e) {
            System.err.println("LỖI CRITICAL: Không thể tạo hồ sơ nghiệp vụ cho User ID " + userId + " (Role: " + user.getRole() + "). Chi tiết: " + e.getMessage());
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

    @Override
    public Optional<User> getUserByEmail(String email) {

        return userRepository.findByEmail(email);
    }

    @Override
    public Boolean existsByEmail(String email) {
        // Sử dụng phương thức mới của Repository
        return userRepository.existsByEmail(email);
    }
}