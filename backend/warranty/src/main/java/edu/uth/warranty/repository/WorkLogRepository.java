package edu.uth.warranty.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.uth.warranty.model.Worklog;

@Repository
public interface WorkLogRepository extends JpaRepository<Worklog, Long> {
}
