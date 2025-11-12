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

    
    @Autowired
    public AuthController(IUserService userService) {
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest){
       
        Optional<User> userOptional = userService.authenticateUser(loginRequest);
        if(userOptional.isPresent()){
            User user = userOptional.get();

            String roleName = user.getRole().name();
            
            String jwtToken = "MOCK_JWT_TOKEN_" + user.getUsername() + "_" + user.getRole();

            
            LoginResponse response = new LoginResponse(
                    user.getId(),
                    user.getUsername(),
                    roleName,
                    jwtToken
            );
            return ResponseEntity.ok(response);
        } else {
            
            return ResponseEntity.status(401).body(new MessageResponse("Tên đăng nhập hoặc mật khẩu không đúng."));
        }
    }


    
}
