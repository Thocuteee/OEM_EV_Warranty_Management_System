package edu.uth.warranty.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.math.BigDecimal;

@Entity
@Table(name = "WarrantyClaim")
public class WarrantyClaim {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long claim_id;

    @ManyToOne
    @JoinColumn(name = "staff_id", nullable = false)
    private Long staff_id;

    private Long vehicle_id;

    private Long customer_id;

    private Long technician_id;

    private Long center_id;

    @Column(name = "status", nullable = false, unique = true)
    private String status;

    private String description;

    @Column(name = "created_at")
    private LocalDateTime created_at;

    @Column(name = "updated_at")
    private LocalDateTime updated_at;

    @Column(name = "total_cost", precision = 10, scale = 2, nullable = false)
    private BigDecimal total_cost;

    private String approval_status;

    public Long getClaim_id() {
        return claim_id;
    }

    public void setClaim_id(Long claim_id) {
        this.claim_id = claim_id;
    }

    public Long getStaff_id() {
        return staff_id;
    }

    public void setStaff_id(Long staff_id) {
        this.staff_id = staff_id;
    }

    public Long getVehicle_id() {
        return vehicle_id;
    }

    public void setVehicle_id(Long vehicle_id) {
        this.vehicle_id = vehicle_id;
    }

    public Long getCustomer_id() {
        return customer_id;
    }

    public void setCustomer_id(Long customer_id) {
        this.customer_id = customer_id;
    }

    public Long getTechnician_id() {
        return technician_id;
    }

    public void setTechnician_id(Long technician_id) {
        this.technician_id = technician_id;
    }

    public Long getCenter_id() {
        return center_id;
    }

    public void setCenter_id(Long center_id) {
        this.center_id = center_id;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getCreated_at() {
        return created_at;
    }

    public void setCreated_at(LocalDateTime created_at) {
        this.created_at = created_at;
    }

    public LocalDateTime getUpdated_at() {
        return updated_at;
    }

    public void setUpdated_at(LocalDateTime updated_at) {
        this.updated_at = updated_at;
    }

    public BigDecimal getTotal_cost() {
        return total_cost;
    }

    public void setTotal_cost(BigDecimal total_cost) {
        this.total_cost = total_cost;
    }

    public String getApproval_status() {
        return approval_status;
    }

    public void setApproval_status(String approval_status) {
        this.approval_status = approval_status;
    }

    public WarrantyClaim() {
    }

    public WarrantyClaim(Long staff_id, Long vehicle_id, Long customer_id, Long technician_id, 
    Long center_id, String status, String description, LocalDateTime created_at, 
    LocalDateTime updated_at, BigDecimal total_cost, String approval_status) {
        this.staff_id = staff_id;
        this.vehicle_id = vehicle_id;
        this.customer_id = customer_id;
        this.technician_id = technician_id;
        this.center_id = center_id;
        this.status = status;
        this.description = description;
        this.created_at = created_at;
        this.updated_at = updated_at;
        this.total_cost = total_cost;
        this.approval_status = approval_status;
    }


}   
