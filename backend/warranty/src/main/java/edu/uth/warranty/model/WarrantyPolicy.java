package edu.uth.warranty.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
    private Long mileageLimit;

    @Column(name = "coverage_description", columnDefinition = "TEXT")
    private String coverageDescription;
}