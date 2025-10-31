package edu.uth.warranty.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.math.BigDecimal;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "WorkLog")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class WorkLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long log_id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "claim_id", nullable = false)
    private WarrantyClaim claim;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "technician_id", nullable = false)
    private Technician technician;

    @Column(name = "start_time", nullable = false)
    private LocalDate startTime;

    @Column(name = "end_time", nullable = false)
    private LocalDate endTime;
    
    @Column(name = "log_date")
    private LocalDate logDate;

    @Column(name = "duration", precision = 5, scale = 2) 
    private BigDecimal duration;
    
    @Column(name = "notes")
    private String notes;
}
