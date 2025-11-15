package edu.uth.warranty.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClaimAttachmentResponse {
    private Long id;

    private Long claimId;

    private String fileUrl;
    private String type;

    
    
}
