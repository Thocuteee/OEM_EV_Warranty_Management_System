package edu.uth.warranty.model;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "ClaimPart")
public class ClaimPart 
{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "claim_part_id")
    private Long claim_part_id;

    @Column(name = "claim_id")
    private Long claim_id;

    @Column(name = "part_id")
    private Long part_id;

    @Column(name = "quantity")
    private Integer quantity;

    @Column(name = "unit_price")
    private Double unit_price;

    public Long getClaim_part_id() {
        return claim_part_id;
    }

    public void setClaim_part_id(Long claim_part_id) {
        this.claim_part_id = claim_part_id;
    }

    public Long getClaim_id() {
        return claim_id;
    }

    public void setClaim_id(Long claim_id) {
        this.claim_id = claim_id;
    }

    public Long getPart_id() {
        return part_id;
    }

    public void setPart_id(Long part_id) {
        this.part_id = part_id;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Double getUnit_price() {
        return unit_price;
    }

    public void setUnit_price(Double unit_price) {
        this.unit_price = unit_price;
    }

    public ClaimPart() {
    }

    public ClaimPart(Long claim_id, Long part_id, Integer quantity, Double unit_price) {
        this.claim_id = claim_id;
        this.part_id = part_id;
        this.quantity = quantity;
        this.unit_price = unit_price;
    }
}