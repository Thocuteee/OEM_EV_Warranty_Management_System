package edu.uth.warranty.model;

import jakarta.persistence.*;

@Entity
@Table(name = "ServiceCenter")
public class ServiceCenter {
    private Long center_id;

    @Column(name = "name", nullable = false, unique = true)
    private String name;

    @Column(name = "location", nullable = false)
    private String location;

    public Long getCenter_id() {
        return center_id;
    }

    public void setCenter_id(Long center_id) {
        this.center_id = center_id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public ServiceCenter() {
    }

    public ServiceCenter(String name, String location) {
        this.name = name;
        this.location = location;
    }


}
