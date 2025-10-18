package edu.uth.warranty.model;

import jakarta.persistence.*;

@Entity
@Table(name = "Technician")
public class Technician {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private String technician_id;

    @ManyToMany
    @JoinColumn(name= "claim_id")
    private String claim_id;

    @ManyToOne
    @JoinColumn(name ="center_id")
    private String center_id;

    @Column(name="name", nullable = false)
    private String name;

    @Column(name="phone", nullable = false, unique = true)
    private Long phone;

    @Column(name="email",nullable = false, unique = true)
    private String email;

    @Column(name="specialization",nullable = false)
    private String specialization;

    public String getTechnician_id() {
        return technician_id;
    }

    public void setTechnician_id(String technician){
        this.technician_id = technician_id;
    }

    public String getClaim() {
        return claim_id;
    }

    public void setClaim(String claim) {
        this.claim_id = claim_id;
    }

    public String getCenter() {
        return center_id;
    }

    public void setCenter(String center) {
        this.center_id = center_id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getPhone() {
        return phone;
    }

    public void setPhone(Long phone) {
        this.phone = phone;
    }

    public String email() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSpecialization() {
        return specialization;
    }

    public void setSpecialization( String specialization) {
        this.specialization = specialization;
    }

    public Technician() {

    }

    public Technician(String technician_id, String claim_id, String center_id, String name, Long phone, String email, String specialization) {
        this.technician_id = technician_id;
        this.claim_id = claim_id;
        this.center_id = center_id;
        this.name = name;
        this.phone = phone;
        this.email = email;
        this.specialization = specialization;
    }
}