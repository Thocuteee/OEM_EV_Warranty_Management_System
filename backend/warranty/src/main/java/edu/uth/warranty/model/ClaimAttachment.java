package edu.uth.warranty.model;

import jakarta.persistence.*;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "ClaimAttachment")
public class ClaimAttachment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long attachmentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "claim_id", nullable = false)
    private WarrantyClaim claim;

    @Column(name = "file_url", nullable = false)
    private String fileUrl;

    @Column(name = "type", nullable = false)
    private String type;

    

    
}
