package edu.uth.warranty.model;

import jakarta.persistence.*;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "Technician")
public class Technician {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long technicianId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name ="center_id", nullable = false)
    private ServiceCenter center;

    @Column(name="name", nullable = false)
    private String name;

    @Column(name="phone", nullable = false, unique = true)
    private String phone;

    @Column(name="email",nullable = false, unique = true)
    private String email;

    @Column(name="specialization",nullable = false)
    private String specialization;

    public Technician(ServiceCenter center, String name, String phone, String email, String specialization) {
        this.center = center;
        this.name = name;
        this.phone = phone;
        this.email = email;
        this.specialization = specialization;
    }
}