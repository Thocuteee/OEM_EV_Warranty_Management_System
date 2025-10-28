package edu.uth.warranty.service;

import edu.uth.warranty.model.User;
import edu.uth.warranty.common.Role;
import edu.uth.warranty.dto.LoginRequest;

import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.List;

@Service
public interface IUserService {
    // Nó không có thân code, chỉ có dấu chấm phẩy ở cuối.
    Optional<User> authenticateUser(LoginRequest loginRequest);
    
    List<User> getAllUsers();

    //Lấy User theo ID.
    Optional<User> getUserById(Long id);

    //Tạo mới hoặc Cập nhật User.
    User saveUser(User user);

    //Xóa User theo ID.
    void deleteUser(Long id);

    //Tìm kiếm User theo Role.
    List<User> getUsersByRole(Role role);

    //Kiểm tra tồn tại User bằng Username.
    Boolean existsByUsername(String username);
}
