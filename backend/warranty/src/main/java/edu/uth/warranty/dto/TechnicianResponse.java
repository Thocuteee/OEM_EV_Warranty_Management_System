package edu.uth.warranty.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TechnicianResponse {
    public TechnicianResponse(Long technician_id, String name2, String phone2, String email2, String specialization2) {
        //TODO Auto-generated constructor stub
    }
    private Long id;
    private Long centerId;
    private String centerName;
    private String name;
    private String phone;
    private String email;
    private String specialization;
}
