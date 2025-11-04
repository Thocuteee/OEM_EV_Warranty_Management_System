package edu.uth.warranty.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.validation.constraints.NotBlank;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CenterRequest {
    private Long id; 
    
    @NotBlank(message = "Tên trung tâm không được để trống")
    private String name; // Unique
    
    @NotBlank(message = "Vị trí là bắt buộc")
    private String location;
}
