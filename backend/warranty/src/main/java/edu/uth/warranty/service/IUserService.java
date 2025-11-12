package edu.uth.warranty.service;

import java.util.Optional;
import java.util.List;

import edu.uth.warranty.common.Role;
import edu.uth.warranty.dto.LoginRequest;
import edu.uth.warranty.model.Technician;
import edu.uth.warranty.model.User;


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

    List<Technician> findByCenter(Long centerId);
}
