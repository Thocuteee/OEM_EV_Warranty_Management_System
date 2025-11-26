package edu.uth.warranty.model;

import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
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
@Table(name = "Vehicle")
public class Vehicle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long vehicleId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @Column(name = "vin", nullable = false, unique = true)
    private String VIN;

    @Column(name = "model", nullable = false)
    private String model;
    
    @Column(name = "year", nullable = false)
    private String year;
    
    @Column(name = "purchase_date")
    private LocalDate purchaseDate;

    @Column(name = "current_mileage")
    private Long currentMileage = 0L;

    @OneToMany(mappedBy = "vehicleEntity", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<CampaignVehicle> campaignVehicles;

    public Vehicle(Long vehicleId) {
        this.vehicleId = vehicleId;
    }
    
    @Column(name = "registration_status", nullable = false)
    private String registrationStatus = "PENDING";

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "registered_by_user_id") 
    private User registeredBy;

    public Vehicle(Long vehicleId, Customer customer, String VIN, String model, String year, String registrationStatus, User registeredBy) {
        this.vehicleId = vehicleId;
        this.customer = customer;
        this.VIN = VIN;
        this.model = model;
        this.year = year;
        this.registrationStatus = registrationStatus;
        this.registeredBy = registeredBy;
    }
}
