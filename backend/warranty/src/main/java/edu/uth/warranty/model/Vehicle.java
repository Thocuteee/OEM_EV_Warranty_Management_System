package edu.uth.warranty.model;

import jakarta.persistence.*;

@Entity
@Table(name = "Vehicle")
public class Vehicle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long vehicle_id;

    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private Long customer_id;

    @Column(name = "VIN", nullable = false, unique = true)
    private String VIN;

    @Column(name = "model", nullable = false, unique = true)
    private String model;
    
    @Column(name = "year", nullable = false)
    private String year;

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

    public String getVIN() {
        return VIN;
    }

    public void setVIN(String VIN) {
        this.VIN = VIN;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public String getYear() {
        return year;
    }

    public void setYear(String year) {
        this.year = year;
    }

    public Vehicle() {
        
    }

    public Vehicle(Long customer_id, String VIN, String model, String year) {
        this.customer_id = customer_id;
        this.VIN = VIN;
        this.model = model;
        this.year = year;
    }


}
