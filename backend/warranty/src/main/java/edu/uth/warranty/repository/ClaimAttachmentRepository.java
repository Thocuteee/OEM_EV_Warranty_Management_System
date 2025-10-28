package edu.uth.warranty.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.uth.warranty.model.ClaimAttachment;

@Repository
public interface ClaimAttachmentRepository extends JpaRepository<ClaimAttachment, Long> {
}
