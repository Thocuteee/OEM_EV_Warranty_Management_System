package edu.uth.warranty.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.uth.warranty.model.ClaimPart;

@Repository
public interface ClaimPartRepository extends JpaRepository<ClaimPart, Long> {
}
