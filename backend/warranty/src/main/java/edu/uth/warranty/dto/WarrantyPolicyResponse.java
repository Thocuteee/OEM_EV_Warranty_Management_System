package edu.uth.warranty.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WarrantyPolicyResponse {
    private Long id;
    private String policyName;
    private Integer durationMonths;
    private Long mileageLimit;
    private String coverageDescription;
}