package edu.uth.warranty.model;
<<<<<<< HEAD
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
=======

import jakarta.persistence.*;
import java.math.BigDecimal;

import java.io.Serializable;
import java.util.Objects;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;


@Entity
@Getter
@Setter
@NoArgsConstructor
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
>>>>>>> main

    @Column(name = "quantity")
    private Integer quantity;

<<<<<<< HEAD
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
=======
    @Column(name = "unit_price", precision = 10, scale = 2, nullable = false)
    private BigDecimal unitPrice;

    @Column(name = "total_price", precision = 10, scale = 2, nullable = false)
    private BigDecimal totalPrice;

    public ClaimPart(WarrantyClaim claim, Part part, Integer quantity, BigDecimal unit_price, BigDecimal total_price) {
        this.claim = claim;
        this.part = part;
        this.quantity = quantity;
        this.unitPrice = unit_price;
        this.totalPrice = total_price;
    }
}
>>>>>>> main
