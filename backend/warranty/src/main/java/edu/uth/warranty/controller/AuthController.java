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
        // 1. Gọi Service để xác thực bằng Username hoặc Email (Logic đã được sửa trong UserServiceImpl)
        Optional<User> userOptional = userService.authenticateUser(loginRequest);
        
        if(userOptional.isPresent()){
            User user = userOptional.get();

            String roleName = user.getRole().name();
            
            // MOCK JWT TOKEN: (Giữ nguyên)
            String jwtToken = "MOCK_JWT_TOKEN_" + user.getUsername() + "_" + user.getRole();

            // 2. Trả về response thành công (Phải bao gồm trường email mới)
            LoginResponse response = new LoginResponse(
                    user.getId(),
                    user.getUsername(),
                    user.getEmail(), 
                    roleName,
                    jwtToken
            );
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(401).body(new MessageResponse("Tên đăng nhập hoặc mật khẩu không đúng."));
        }
    }


}
