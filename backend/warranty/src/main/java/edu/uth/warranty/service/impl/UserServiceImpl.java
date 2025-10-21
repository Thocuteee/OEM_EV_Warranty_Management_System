package edu.uth.warranty.service.impl;

import edu.uth.warranty.model.User;
import edu.uth.warranty.repository.UserRepository;
import edu.uth.warranty.dto.LoginRequest;
import edu.uth.warranty.service.IUserService;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserServiceImpl implements IUserService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
       
    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;

    }

    @Override
    public Optional<User> authenticateUser(LoginRequest loginRequest) {
        Optional<User> userOpt = userRepository.findByUsername(loginRequest.getUsername());
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            // So sánh mật khẩu đầu vào (chưa mã hóa) với mật khẩu đã mã hóa trong DB
            if (passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
                return Optional.of(user);
            }
        }
        return Optional.empty();
    }
    
    
}