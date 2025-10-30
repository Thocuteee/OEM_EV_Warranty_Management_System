package edu.uth.warranty.model;

import jakarta.persistence.*;
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
@Table(name = "Part")
public class Part {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long part_id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "part_number", nullable = false, unique = true)
    private String partNumber;

    @Column(name = "price", precision = 10, scale = 2, nullable = false)
    private BigDecimal price;

    
}
