package edu.uth.warranty.model;
import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "Worklog")
public class Worklog 
{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "log_id")
    private Long log_id;

    @Column(name = "claim_id")
    private Long claim_id;

    @Column(name = "technician_id")
    private Long technician_id;

    @Column(name = "start_time")
    private LocalDateTime start_time;

    @Column(name = "end_time")
    private LocalDateTime end_time;

    @Column(name = "log_date")
    private LocalDate log_date;

    @Column(name = "duration")
    private Double duration;

    @Column(name = "notes")
    private String notes;

    public Long getLog_id() { return log_id; }
    public void setLog_id(Long log_id) { this.log_id = log_id; }

    public Long getClaim_id() { return claim_id; }
    public void setClaim_id(Long claim_id) { this.claim_id = claim_id; }

    public Long getTechnician_id() { return technician_id; }
    public void setTechnician_id(Long technician_id) { this.technician_id = technician_id; }

    public LocalDateTime getStart_time() { return start_time; }
    public void setStart_time(LocalDateTime start_time) { this.start_time = start_time; }

    public LocalDateTime getEnd_time() { return end_time; }
    public void setEnd_time(LocalDateTime end_time) { this.end_time = end_time; }

    public LocalDate getLog_date() { return log_date; }
    public void setLog_date(LocalDate log_date) { this.log_date = log_date; }

    public Double getDuration() { return duration; }
    public void setDuration(Double duration) { this.duration = duration; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public Worklog() {
    }

    public Worklog(Long claim_id, Long technician_id, LocalDateTime start_time, LocalDateTime end_time,
                   LocalDate log_date, Double duration, String notes) {
        this.claim_id = claim_id;
        this.technician_id = technician_id;
        this.start_time = start_time;
        this.end_time = end_time;
        this.log_date = log_date;
        this.duration = duration;
        this.notes = notes;
    }
}