package edu.uth.warranty.model;

import jakarta.persistence.*;
import java.time.LocalDate;


@Entity
@Table(name = "VehiclePart")
public class VehiclePartHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long history_id;

    @ManyToOne
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Long vehicle_id;

    
    private Long part_serial_id;

    private Long claim_id;

    private LocalDate date_installed;

    public Long getHistory_id() {
        return history_id;
    }

    public void setHistory_id(Long history_id) {
        this.history_id = history_id;
    }

    public Long getVehicle_id() {
        return vehicle_id;
    }

    public void setVehicle_id(Long vehicle_id) {
        this.vehicle_id = vehicle_id;
    }

    public Long getPart_serial_id() {
        return part_serial_id;
    }

    public void setPart_serial_id(Long part_serial_id) {
        this.part_serial_id = part_serial_id;
    }

    public Long getClaim_id() {
        return claim_id;
    }

    public void setClaim_id(Long claim_id) {
        this.claim_id = claim_id;
    }

    public LocalDate getDate_installed() {
        return date_installed;
    }

    public void setDate_installed(LocalDate date_installed) {
        this.date_installed = date_installed;
    }

    public VehiclePartHistory() {
    }

    public VehiclePartHistory(Long vehicle_id, Long part_serial_id, Long claim_id, LocalDate date_installed) {
        this.vehicle_id = vehicle_id;
        this.part_serial_id = part_serial_id;
        this.claim_id = claim_id;
        this.date_installed = date_installed;
    }


}
