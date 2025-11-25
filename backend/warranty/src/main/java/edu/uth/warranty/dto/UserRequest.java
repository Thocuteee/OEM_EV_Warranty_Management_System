package edu.uth.warranty.dto;

import edu.uth.warranty.common.Role;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserRequest {
    private Long id; 

    @NotBlank(message = "Username không được để trống")
    private String username;

    @NotBlank(message = "Email không được để trống")
    @Email(message = "Định dạng Email không hợp lệ")
    private String email;

    // Password là bắt buộc khi tạo mới, tùy chọn khi cập nhật
    @NotBlank(message = "Password là bắt buộc khi tạo mới")
    private String password; 

    @NotNull(message = "Role là bắt buộc")
    private Role role;

    //Thêm staff,technician sau 
}
