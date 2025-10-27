package edu.uth.warranty.controller;

import edu.uth.warranty.dto.LoginResponse;
import edu.uth.warranty.dto.LoginRequest;
import edu.uth.warranty.dto.MessageResponse;
import edu.uth.warranty.model.User;
import edu.uth.warranty.service.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

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
                    user.getUser_id(),
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


    
}
