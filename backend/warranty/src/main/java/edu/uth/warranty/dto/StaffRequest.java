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
public class StaffRequest {
    private Long id;

    @NotNull(message = "Service Center ID là bắt buộc")
    private Long centerId;

    @NotBlank(message = "Tên là bắt buộc")
    private String name;
    
    @NotNull(message = "Vai trò là bắt buộc")
    private Role role;
    
    @NotBlank(message = "Số điện thoại là bắt buộc")
    private String phone;

    @NotBlank(message = "Email là bắt buộc")
    @Email(message = "Email không hợp lệ")
    private String email;

    // Thông tin Đăng nhập
    @NotBlank(message = "Username là bắt buộc")
    private String username;
    
    // Mật khẩu (Service sẽ hash)
    @NotBlank(message = "Password là bắt buộc khi tạo/cập nhật")
    private String password;

    
}
