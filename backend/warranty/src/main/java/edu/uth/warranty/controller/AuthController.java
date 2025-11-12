package edu.uth.warranty.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.uth.warranty.dto.LoginRequest;
import edu.uth.warranty.dto.LoginResponse;
import edu.uth.warranty.dto.MessageResponse;
import edu.uth.warranty.dto.UserRequest;
import edu.uth.warranty.model.User;
import edu.uth.warranty.service.IUserService;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final IUserService userService;

    // Sử dụng Constructor Injection để tim Service
    @Autowired
    public AuthController(IUserService userService) {
        this.userService = userService;
    }

    // API: POST /api/auth/login
    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest){
        // 1. Gọi Service để xác thực người dùng
        Optional<User> userOptional = userService.authenticateUser(loginRequest);
        if(userOptional.isPresent()){
            User user = userOptional.get();

            String roleName = user.getRole().name();
            
            String jwtToken = "MOCK_JWT_TOKEN_" + user.getUsername() + "_" + user.getRole();

            // 2. Trả về response thành công (HTTP 200 OK)
            // FE cần username và token để lưu trữ và hiển thị
            LoginResponse response = new LoginResponse(
                    user.getId(),
                    user.getUsername(),
                    roleName,
                    jwtToken
            );
            return ResponseEntity.ok(response);
        } else {
            // 3. Xác thực thất bại, trả về lỗi 401 Unauthorized
            return ResponseEntity.status(401).body(new MessageResponse("Tên đăng nhập hoặc mật khẩu không đúng."));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody UserRequest registerRequest) {
        try {
            // Tái sử dụng toEntity từ UserController nếu cần, hoặc tạo logic chuyển đổi tại đây
            User userToRegister = new User();
            userToRegister.setUsername(registerRequest.getUsername());
            userToRegister.setPassword(registerRequest.getPassword()); 
            userToRegister.setRole(registerRequest.getRole()); // Giả định Role được gửi trong Request

            // Service sẽ xử lý mã hóa mật khẩu và kiểm tra trùng lặp (Username, Email)
            User registeredUser = userService.saveUser(userToRegister); 
            
            // Trả về HTTP 201 Created với thông báo thành công
            return ResponseEntity.status(HttpStatus.CREATED).body(new MessageResponse("Đăng ký tài khoản " + registeredUser.getUsername() + " thành công."));
        } catch (IllegalArgumentException e) {
            // Bắt lỗi nghiệp vụ (ví dụ: Username đã tồn tại)
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
}
