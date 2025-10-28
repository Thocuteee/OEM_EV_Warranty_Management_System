package edu.uth.warranty.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.uth.warranty.model.Report;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {
}
