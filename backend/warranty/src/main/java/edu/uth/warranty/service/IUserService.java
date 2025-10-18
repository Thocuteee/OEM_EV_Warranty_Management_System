package edu.uth.warranty.service;

import edu.uth.warranty.model.User;
import edu.uth.warranty.dto.LoginRequest;


import java.util.Optional;


public interface IUserService {
    // Nó không có thân code, chỉ có dấu chấm phẩy ở cuối.
    Optional<User> authenticateUser(LoginRequest loginRequest);
    
    String getPassword();
}
