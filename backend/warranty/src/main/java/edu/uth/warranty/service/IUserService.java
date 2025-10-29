package edu.uth.warranty.service;

import java.util.Optional;

import edu.uth.warranty.dto.LoginRequest;
import edu.uth.warranty.model.User;


public interface IUserService {
    // Nó không có thân code, chỉ có dấu chấm phẩy ở cuối.
    Optional<User> authenticateUser(LoginRequest loginRequest);
    
    String getPassword();
}
