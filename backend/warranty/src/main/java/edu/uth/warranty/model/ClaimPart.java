package edu.uth.warranty.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import jakarta.persistence.IdClass;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import java.io.Serializable;
import java.util.Objects;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;   


@Entity
@Getter
@Setter

@AllArgsConstructor
@Table(name = "ClaimPart")
@IdClass(ClaimPart.IdClass.class)
public class ClaimPart {
    public static class IdClass implements Serializable {
        private Long claim;
        private Long part;

        public IdClass() {}

        public IdClass(Long claim, Long part) {
            this.claim = claim;
            this.part = part;
        }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            IdClass id = (IdClass) o;
            return Objects.equals(claim, id.claim) && Objects.equals(part, id.part);
        }

        @Override
        public int hashCode() {
            return Objects.hash(claim, part);
        }
    }




    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "claim_id", nullable = false)
    private WarrantyClaim claim;
    
    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "part_id", nullable = false)
    private Part part;


    @Column(name = "quantity")
    private Integer quantity;

    @Column(name = "unit_price")
    private Double unit_price;

    private Long claim_part_id;

    private Long claim_id;

    private Long part_id;

    public Long getClaim_part_id() {
        return claim_part_id;
    }

    public void setClaim_part_id(Long claim_part_id) {
        this.claim_part_id = claim_part_id;
    }

    public Long getClaim_id() {
        return claim.getClaim_id();
    }
    public void setClaim_id(Long claim_id) {
        this.claim.setClaim_id(claim_id);
    }
    public Long getPart_id() {
        return part.getPart_id();
    }

    public void setPart_id(Long part_id) {
        this.part.setPart_id(part_id);
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
