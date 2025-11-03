package edu.uth.warranty.model;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

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
public class ClaimAttachment 
{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "attachment_id")
    private Long attachment_id;

<<<<<<< HEAD
    @Column(name = "claim_id")
    private Long claim_id;

    @Column(name = "file_url")
    private String file_url;
=======
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "claim_id", nullable = false)
    private WarrantyClaim claim;

    @Column(name = "file_url", nullable = false)
    private String fileUrl;
>>>>>>> main

    @Column(name = "type")
    private String type;

<<<<<<< HEAD
    public Long getAttachment_id() {
        return attachment_id;
    }

    public void setAttachment_id(Long attachment_id) {
        this.attachment_id = attachment_id;
    }

    public Long getClaim_id() {
        return claim_id;
    }

    public void setClaim_id(Long claim_id) {
        this.claim_id = claim_id;
    }

    public String getFile_url() {
        return file_url;
    }

    public void setFile_url(String file_url) {
        this.file_url = file_url;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public ClaimAttachment() {
    }

    public ClaimAttachment(Long claim_id, String file_url, String type) {
        this.claim_id = claim_id;
        this.file_url = file_url;
        this.type = type;
    }
}
=======
    

    
}
>>>>>>> main
