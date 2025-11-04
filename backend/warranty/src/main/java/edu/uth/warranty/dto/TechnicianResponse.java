package edu.uth.warranty.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TechnicianResponse {
    private Long id;
    private Long centerId;
    private String centerName;
    private String name;
    private String phone;
    private String email;
    private String specialization;
}
