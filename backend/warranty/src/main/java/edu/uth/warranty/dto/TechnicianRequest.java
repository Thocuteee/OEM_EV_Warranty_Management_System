package edu.uth.warranty.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TechnicianRequest {
    private Long id;

    @NotNull(message = "Service Center ID là bắt buộc")
    private Long centerId;

    // Information 
    @NotBlank(message = "Tên là bắt buộc")
    private String name;
    
    @NotBlank(message = "Số điện thoại là bắt buộc")
    @Pattern(regexp = "^(0|\\+84)\\d{9,10}$", message = "Số điện thoại không hợp lệ")
    private String phone; 
    
    @NotBlank(message = "Email là bắt buộc")
    @Email(message = "Email không hợp lệ")
    private String email; 
    @NotBlank(message = "Chuyên môn là bắt buộc")
    private String specialization; // Ví dụ: Battery, Motor, Charging
}
