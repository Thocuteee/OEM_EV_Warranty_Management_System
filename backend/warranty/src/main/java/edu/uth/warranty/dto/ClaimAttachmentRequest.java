package edu.uth.warranty.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClaimAttachmentRequest {
    private Long id;

    @NotNull(message = "Claim ID là bắt buộc")
    private Long claimId;
    
    // Thông tin File
    @NotBlank(message = "File URL là bắt buộc")
    @Size(max = 255, message = "URL không được vượt quá 255 ký tự")
    private String fileUrl; // URL lưu trữ file
    
    @NotBlank(message = "Loại file là bắt buộc")
    private String type; // Ví dụ: IMAGE, DOCUMENT, VIDEO
}
