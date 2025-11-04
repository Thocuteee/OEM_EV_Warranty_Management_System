package edu.uth.warranty.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

import java.io.Serializable;
import java.util.Objects;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@Setter
@NoArgsConstructor
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

    @Column(name = "unit_price", precision = 10, scale = 2, nullable = false)
    private BigDecimal unitPrice;

    @Column(name = "total_price", precision = 10, scale = 2, nullable = false)
    private BigDecimal totalPrice;

    
}
