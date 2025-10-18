package edu.uth.warranty.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import org.springframework.data.repository.query.parser.Part;

@Entity
@Table(name = "PartSerial")
public class PartSerial {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long part_serial_id;

    @ManyToOne
    @JoinColumn(name = "part_id", nullable = false)
    private Long part_id;

    @Column(name = "serial_number", nullable = false, unique = true)
    private String serial_number;

    private LocalDate date_received;

    public Long getPart_serial_id() {
        return part_serial_id;
    }

    public void setPart_serial_id(Long part_serial_id) {
        this.part_serial_id = part_serial_id;
    }

    public Long getPart_id() {
        return part_id;
    }

    public void setPart_id(Long part_id) {
        this.part_id = part_id;
    }

    public String getSerial_number() {
        return serial_number;
    }

    public void setSerial_number(String serial_number) {
        this.serial_number = serial_number;
    }

    public LocalDate getDate_received() {
        return date_received;
    }

    public void setDate_received(LocalDate date_received) {
        this.date_received = date_received;
    }

    public PartSerial() {}

    public PartSerial(Long part_id, String serial_number, LocalDate date_received) {
        this.part_id = part_id;
        this.serial_number = serial_number;
        this.date_received = date_received;
    }


}   
