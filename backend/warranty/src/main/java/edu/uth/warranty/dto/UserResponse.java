package edu.uth.warranty.dto;

import edu.uth.warranty.common.Role;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    public UserResponse(Long id2, String username2, String password, Role role2) {
        //TODO Auto-generated constructor stub
    }
    private Long id;
    private String username;
    private Role role;
}
