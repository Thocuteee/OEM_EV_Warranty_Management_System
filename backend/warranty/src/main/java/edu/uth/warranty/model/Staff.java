package edu.uth.warranty.model;

import jakarta.persistence.*;


@Entity
@Table(name = "Staff")
public class Staff {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long staff_id;

    @OneToMany
    @JoinColumn(name = "center_id", nullable = false)
    private Long center_id;

    @Column(name = "name", nullable = false)
    private String name;

    private enum role {Staff}

    @Column(name = "phone", nullable = false, unique = true)
    private String phone;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "username", nullable = false)
    private String username;

    @Column(name = "password", nullable = false)
    private String password;

    public Long getStaff_id() {
        return staff_id;
    }

    public void setStaff_id(Long staff_id) {
        this.staff_id = staff_id;
    }

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

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Staff() {

    }

    public Staff(Long center_id, String name, String phone, String email, String username, String password) {
        this.center_id = center_id;
        this.name = name;
        this.phone = phone;
        this.email = email;
        this.username = username;
        this.password = password;
    }


}
