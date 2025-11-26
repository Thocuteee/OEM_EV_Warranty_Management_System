package edu.uth.warranty.repository;

import edu.uth.warranty.model.User;
import edu.uth.warranty.common.Role;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    
    Optional<User> findByUsername(String username);
    
    Boolean existsByUsername(String username);

    List<User> findByRole(Role role);

    Optional<User> findByEmail(String email); 
    
    Boolean existsByEmail(String email);  
}

