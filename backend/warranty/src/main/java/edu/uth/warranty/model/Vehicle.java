package edu.uth.warranty.model;

import java.util.List;

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
@Table(name = "Vehicle")
public class Vehicle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long vehicleId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @Column(name = "VIN", nullable = false, unique = true)
    private String VIN;

    @Column(name = "model", nullable = false)
    private String model;
    
    @Column(name = "year", nullable = false)
    private String year;

    @OneToMany(mappedBy = "vehicle", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<CampaignVehicle> campaignVehicles;

    public Vehicle(Long vehicleId) {
        this.vehicleId = vehicleId;
    }
    
    @Column(name = "registration_status", nullable = false)
    private String registrationStatus = "PENDING";

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "registered_by_user_id") // Người đã tạo yêu cầu đăng ký
    private User registeredBy;

    
}
