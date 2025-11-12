package edu.uth.warranty.controller;

import edu.uth.warranty.model.User;
import edu.uth.warranty.service.IUserService;
import edu.uth.warranty.dto.UserRequest;
import edu.uth.warranty.dto.UserResponse;

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

    // Chuyển Entity sang DTO Response
    private UserResponse toResponseDTO(User user) {
        return new UserResponse(
            user.getId(),                  
            user.getUsername(),            
            user.getPassword(),
            user.getRole()
        );
    }

    // Chuyển DTO Request sang Entity
    private User toEntity(UserRequest request) {
        User user = new User();
        if (request.getId() != null) {
            user.setId(request.getId());
        }
        user.setUsername(request.getUsername());
        user.setPassword(request.getPassword());
        user.setRole(request.getRole());
        return user;
    }

    //POST /api/users : Tạo mới User
    @PostMapping
    public ResponseEntity<UserResponse> createUser(@Valid @RequestBody UserRequest request) {
        User newUser = toEntity(request);
        User savedUser = userService.saveUser(newUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponseDTO(savedUser));
    }

    //GET /api/users : Lấy danh sách User
    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        List<UserResponse> responses = users.stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    //GET /api/users/{id} : Lấy chi tiết User
    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
        Optional<User> user = userService.getUserById(id);
        if (user.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(toResponseDTO(user.get()));
    }

    //PUT /api/users/{id} : Cập nhật User
    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> updateUser(@PathVariable Long id, @RequestBody UserRequest request) {
        request.setId(id);
        if (userService.getUserById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User updatedUser = userService.saveUser(toEntity(request));
        return ResponseEntity.ok(toResponseDTO(updatedUser));
    }

    //DELETE /api/users/{id} : Xóa User
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        if (userService.getUserById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
