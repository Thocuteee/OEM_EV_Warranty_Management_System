package edu.uth.warranty.controller;

import edu.uth.warranty.dto.UserRequest;
import edu.uth.warranty.dto.UserResponse;
import edu.uth.warranty.model.User;
import edu.uth.warranty.common.Role;
import edu.uth.warranty.service.IUserService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final IUserService userService;

    public UserController(IUserService userService) {
        this.userService = userService;
    }

    // Chuyển đổi Entity sang Response DTO (Loại bỏ mật khẩu)
    private UserResponse toResponseDTO(User user) {
        return new UserResponse(
            user.getId(),
            user.getUsername(),
            user.getEmail(),
            user.getRole()
        );
    }

    private User toEntity(UserRequest request) {
        User user = new User();

        // ID chỉ được set khi cập nhật
        if(request.getId() != null) {
            user.setId(request.getId());
        }
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setRole(request.getRole());
        return user;
    }

    // 1. POST /api/users : Tạo mới User (Admin/EVM Staff)
    @PostMapping
    public ResponseEntity<UserResponse> createUser(@Valid @RequestBody UserRequest request) {
        User newUser = toEntity(request);
        User saveUser = userService.saveUser(newUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponseDTO(saveUser));
    }


    // 2. GET /api/users : Lấy tất cả User
    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        List<UserResponse> response = users.stream().map(this::toResponseDTO).collect(Collectors.toList());
        return ResponseEntity.ok(response);
    } 

    // 3. GET /api/users/{id} : Lấy chi tiết User
    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
        Optional<User> user = userService.getUserById(id);
        if(user.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(toResponseDTO(user.get()));
    }

    // 4. PUT /api/users/{id} : Cập nhật User
    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> updateUser(@PathVariable Long id, @Valid @RequestBody UserRequest request) {
        request.setId(id);

        if (userService.getUserById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        User updatedUser = userService.saveUser(toEntity(request)); // Service sẽ xử lý HASH/cập nhật
        return ResponseEntity.ok(toResponseDTO(updatedUser));
    }


    // 5. DELETE /api/users/{id} : Xóa User
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        if (userService.getUserById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        userService.deleteUser(id);
        return ResponseEntity.noContent().build(); 
    }

    // 6. GET /api/users/role?role={role} : Tìm kiếm theo Vai trò
    @GetMapping("/role")
    public ResponseEntity<List<UserResponse>> getUsersByRole(@RequestParam Role role) {
        List<User> users = userService.getUsersByRole(role);
        
        List<UserResponse> response = users.stream().map(this::toResponseDTO).collect(Collectors.toList());
            
        return ResponseEntity.ok(response);
    }

}
