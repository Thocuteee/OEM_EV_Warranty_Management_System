package edu.uth.warranty.model;
import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "Report")
public class Report 
{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "report_id")
    private Long report_id;

    @Column(name = "claim_id")
    private Long claim_id;

    @Column(name = "technician_id")
    private Long technician_id;

    @Column(name = "center_id")
    private Long center_id;

    @Column(name = "vehicle_id")
    private Long vehicle_id;

    @Column(name = "campaign_id")
    private Long campaign_id;

    @Column(name = "report_date")
    private LocalDate report_date;

    @Column(name = "description")
    private String description;

    @Column(name = "status")
    private String status;

    public Long getReport_id() {
        return report_id;
    }

    public void setReport_id(Long report_id) {
        this.report_id = report_id;
    }

    public Long getClaim_id() {
        return claim_id;
    }

    public void setClaim_id(Long claim_id) {
        this.claim_id = claim_id;
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

    public Long getVehicle_id() {
        return vehicle_id;
    }

    public void setVehicle_id(Long vehicle_id) {
        this.vehicle_id = vehicle_id;
    }

    public Long getCampaign_id() {
        return campaign_id;
    }

    public void setCampaign_id(Long campaign_id) {
        this.campaign_id = campaign_id;
    }

    public LocalDate getReport_date() {
        return report_date;
    }

    public void setReport_date(LocalDate report_date) {
        this.report_date = report_date;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

     public Report() {
    }

    public Report(Long claim_id, Long technician_id, Long center_id,
                  Long vehicle_id, Long campaign_id, LocalDate report_date,
                  String description, String status) {
        this.claim_id = claim_id;
        this.technician_id = technician_id;
        this.center_id = center_id;
        this.vehicle_id = vehicle_id;
        this.campaign_id = campaign_id;
        this.report_date = report_date;
        this.description = description;
        this.status = status;
    }
}