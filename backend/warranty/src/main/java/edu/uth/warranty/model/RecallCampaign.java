package edu.uth.warranty.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "RecallCampaign")
public class RecallCampaign {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long campaign_id;

    @Column(name = "title", nullable = false, unique = true)
    private String title;

    private LocalDate start_date;

    private LocalDate end_date;

    public Long getCampaign_id() {
        return campaign_id;
    }

    public void setCampaign_id(Long campaign_id) {
        this.campaign_id = campaign_id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public LocalDate getStart_date() {
        return start_date;
    }

    public void setStart_date(LocalDate start_date) {
        this.start_date = start_date;
    }   

    public LocalDate getEnd_date() {
        return end_date;
    }

    public void setEnd_date(LocalDate end_date) {
        this.end_date = end_date;
    }

    public RecallCampaign() {

    }

    public RecallCampaign(String title, LocalDate start_date, LocalDate end_date) {
        this.title = title;
        this.start_date = start_date;
        this.end_date = end_date;
    }


}
