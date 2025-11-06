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
@Table(name = "ServiceCenter")
public class ServiceCenter {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long CenterId;

    @Column(name = "name", nullable = false, unique = true)
    private String name;

    @Column(name = "location", nullable = false)
    private String location;

    


}
