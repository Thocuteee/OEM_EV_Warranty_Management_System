package edu.uth.warranty.model;
import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Table;

@Entity
@Table(name = "WarrantyClaim")
public class WarrantyClaim
{

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "claim_id")
    private Long claim_id;

    @Column(name = "claim_date")
    private LocalDate claim_date;

    @Column(name = "status")
    private String status;

    @Column(name = "total_cost")
    private Double total_cost;

    @Column(name = "vehicle_id")
    private Long vehicle_id;

    @Column(name = "customer_id")
    private Long customer_id;

    @Column(name = "center_id")
    private Long center_id;

    @Column(name = "technician_id")
    private Long technician_id;

    public Long getClaim_id() {
        return claim_id;
    }

    public void setClaim_id(Long claim_id) {
        this.claim_id = claim_id;
    }

    public LocalDate getClaim_date() {
        return claim_date;
    }

    public void setClaim_date(LocalDate claim_date) {
        this.claim_date = claim_date;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Double getTotal_cost() {
        return total_cost;
    }

    public void setTotal_cost(Double total_cost) {
        this.total_cost = total_cost;
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

    public Long getCenter_id() {
        return center_id;
    }

    public void setCenter_id(Long center_id) {
        this.center_id = center_id;
    }

    public Long getTechnician_id() {
        return technician_id;
    }

    public void setTechnician_id(Long technician_id) {
        this.technician_id = technician_id;
    }


    public WarrantyClaim() {
    }

    public WarrantyClaim(LocalDate claim_date, String status, Double total_cost,
                         Long vehicle_id, Long customer_id, Long center_id, Long technician_id) {
        this.claim_date = claim_date;
        this.status = status;
        this.total_cost = total_cost;
        this.vehicle_id = vehicle_id;
        this.customer_id = customer_id;
        this.center_id = center_id;
        this.technician_id = technician_id;
    }
}

    
