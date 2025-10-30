package edu.uth.warranty.repository;


import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.uth.warranty.model.Part;
import edu.uth.warranty.model.PartSerial;

@Repository
public interface PartSerialRepository extends JpaRepository<PartSerial, Long>{
    Optional<PartSerial> findBySerialNumber(String serialNumber);

    Boolean existsBySerialNumber(String serialNumber);

    List<PartSerial> findByPart(Part part);

    List<PartSerial> findByDateReceivedBetween(LocalDate startDate, LocalDate endDate);

}
