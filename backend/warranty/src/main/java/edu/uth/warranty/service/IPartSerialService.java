package edu.uth.warranty.service;

import edu.uth.warranty.model.PartSerial;
import edu.uth.warranty.model.Part;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

@Service
public interface IPartSerialService {
    List<PartSerial> getAllPartSerials();
    Optional<PartSerial> getPartSerialById(Long id);

    PartSerial savePartSerial(PartSerial partSerial);
    
    void deletePartSerial(Long id);

    Optional<PartSerial> getPartSerialBySerialNumber(String serialNumber);

    Boolean isSerialNumberUnique(String serialNumber);

    List<PartSerial> getPartSerialsByPart(Part part);

    List<PartSerial> getPartSerialsByDateReceivedBetween(LocalDate startDate, LocalDate endDate);
    PartSerial save(PartSerial entity);
    Optional<Part> getAll();
    Optional<Part> getById(Long id);
    void delete(Long id);
}
