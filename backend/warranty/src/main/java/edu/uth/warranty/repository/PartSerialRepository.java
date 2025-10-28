package edu.uth.warranty.repository;

import edu.uth.warranty.model.PartSerial;
import edu.uth.warranty.model.Part;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface PartSerialRepository {
    Optional<PartSerial> findBySerialNumber(String serialNumber);

    Boolean existsBySerialNumber(String serialNumber);

    List<PartSerial> findByPart(Part part);

    List<PartSerial> findByDateReceivedBetween(LocalDate startDate, LocalDate endDate);
}
