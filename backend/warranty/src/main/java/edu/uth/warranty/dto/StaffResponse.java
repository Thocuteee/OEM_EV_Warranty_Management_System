package edu.uth.warranty.dto;

import edu.uth.warranty.common.Role;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StaffResponse {
    private Long id;
    private Long centerId;
    private String centerName;
    private String name;
    private Role role;
    private String phone;
    private String email;
    private String username;
}
