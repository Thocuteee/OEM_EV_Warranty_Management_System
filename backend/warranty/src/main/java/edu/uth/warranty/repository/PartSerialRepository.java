package edu.uth.warranty.repository;

import java.util.List;
import java.util.Optional;
import edu.uth.warranty.model.Part;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.uth.warranty.model.PartSerial;
@Repository
public interface PartSerialRepository extends JpaRepository<PartSerial, Long> {  
    Optional<PartSerial> findByPartSerial_Part(Long partSerial , Part part);

    List<PartSerial> findBySerialNumber(String serialNumber);

    List<PartSerial> findByDateReceived(java.time.LocalDate dateReceived);

    
}
