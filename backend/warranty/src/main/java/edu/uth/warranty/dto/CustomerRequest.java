package edu.uth.warranty.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerRequest {
    private Long id;

    @NotBlank(message = "Tên khách hàng không được để trống")
    private String name;

    @NotBlank(message = "Số điện thoại là bắt buộc")
    @Pattern(regexp = "^(0|\\+84)\\d{9,10}$", message = "Số điện thoại không hợp lệ") // For 9-10 
    private String phone;

    @NotBlank(message = "Email là bắt buộc")
    @Email(message = "Địa chỉ email không hợp lệ")
    private String email; 
    
    @NotBlank(message = "Địa chỉ là bắt buộc")
    private String address;
}
