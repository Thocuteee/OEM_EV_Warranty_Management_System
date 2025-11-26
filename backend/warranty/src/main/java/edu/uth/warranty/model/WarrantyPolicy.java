package edu.uth.warranty.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "WarrantyPolicy")
public class WarrantyPolicy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long policyId;

    @Column(name = "policy_name", nullable = false, unique = true)
    private String policyName;

    @Column(name = "duration_months", nullable = false)
    private Integer durationMonths;

    @Column(name = "mileage_limit", nullable = false)
    private Integer mileageLimit;

    @Column(name = "coverage_description", columnDefinition = "TEXT")
    private String coverageDescription;
}

