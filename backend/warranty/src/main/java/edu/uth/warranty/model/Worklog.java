package edu.uth.warranty.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.math.BigDecimal;

@Entity
@Table(name = "WorkLog")
public class Worklog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long log_id;

    private Long clam_id;

    private Long technician_id;

    private LocalDate start_time;

    private LocalDate end_time;
    

    
}
