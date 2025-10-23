package edu.uth.warranty.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.math.BigDecimal;

import lombok.Getter;
import lombok.Setter;   
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;


@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "Report")
public class Report {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long report_id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "claim_id", nullable = false)
    private WarrantyClaim claim;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "technician_id", nullable = false)
    private Technician technician;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_center_id", nullable = false)
    private ServiceCenter center;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recall_campaign_id", nullable = false)
    private RecallCampaign campaign;

    @Column(name = "status", nullable = false)
    private String status;
    @Column(name = "report_date", nullable = false)
    private LocalDate report_date;

    @Column(name = "started_at")
    private LocalDateTime started_at;

    @Column(name = "finished_at")
    private LocalDateTime finished_at;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String action_taken;

    @Column(columnDefinition = "TEXT")
    private String part_used;

    @Column(columnDefinition = "TEXT")
    private String replaced_part;

    @Column(name = "part_cost", precision = 10, scale = 2)
    private BigDecimal part_cost;

    @Column(name = "labor_cost", precision = 10, scale = 2)
    private BigDecimal actual_cost;

    @Column(name = "created_date")
    private LocalDateTime created_date;

    @Column(name = "created_by")
    private String created_by;

    @Column(name = "updated_at")
    private LocalDateTime updated_at;

    @Column(name = "updated_by")
    private String updated_by;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false) // FK trỏ về User
    private User createdBy;
}
