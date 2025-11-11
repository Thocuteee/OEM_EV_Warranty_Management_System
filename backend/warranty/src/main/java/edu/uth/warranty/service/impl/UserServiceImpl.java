package edu.uth.warranty.service.impl;

import edu.uth.warranty.model.User;
import edu.uth.warranty.common.Role;
import edu.uth.warranty.repository.UserRepository;
import edu.uth.warranty.dto.LoginRequest;
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
        
    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;

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
        
        // 2. FIX LOGIC: Mã hóa mật khẩu nếu nó được cung cấp và KHÔNG rỗng
        // [Lưu ý: Mật khẩu luôn được cung cấp trong RegisterRequest và UserRequest]
        if (user.getPassword() != null && !user.getPassword().isEmpty() && !user.getPassword().startsWith("$2a$")) { 
            // Kiểm tra thêm: nếu nó chưa được mã hóa (bắt đầu bằng $2a$ là đã mã hóa)
            String hashedPassword = passwordEncoder.encode(user.getPassword());
            user.setPassword(hashedPassword);
        }
    
        return userRepository.save(user);
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
    public User registerUser(User user) {
        // Logic đăng ký: Đảm bảo User đang được tạo mới (không có ID)
        if (user.getId() != null) {
            throw new IllegalArgumentException("Lỗi đăng ký: User không thể có ID đã tồn tại.");
        }
        
        // Tận dụng logic mã hóa mật khẩu và kiểm tra trùng lặp từ saveUser
        return saveUser(user);
    }
}