package edu.uth.warranty.repository;

import edu.uth.warranty.model.User;
import edu.uth.warranty.common.Role;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    // Phương thức này sẽ được Spring Data JPA tự động triển khai
    Optional<User> findByUsername(String username);
    
    Boolean existsByUsername(String username);

    List<User> findByRole(Role role);
}

