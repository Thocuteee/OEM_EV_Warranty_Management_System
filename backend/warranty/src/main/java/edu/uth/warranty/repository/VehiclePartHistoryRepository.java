package edu.uth.warranty.repository;

import edu.uth.warranty.model.VehiclePartHistory;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

import edu.uth.warranty.model.Vehicle;


@Repository
public interface VehiclePartHistoryRepository extends JpaRepository<VehiclePartHistory, Long> {

    List<VehiclePartHistory> findByHistory_Vehicle_PartSerial_Claim(Long history ,Vehicle vehicle, Long partSerial, Long claim);

    List<VehiclePartHistory> findByDateInstalled(java.time.LocalDate dateInstalled);
}
