package edu.uth.warranty.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import edu.uth.warranty.model.ServiceCenter;
import edu.uth.warranty.model.Technician;

@Service
public interface ITechnicianService {

    List<Technician> getAllTechnicians();
    Optional<Technician> getTechnicianById(Long id);

    // cap nhat hoac xoa
    Technician saveTechnician(Technician technician);
    void deleteTechnician(Long id);

    // nghiep vu
    Optional<Technician> getTechnicianByEmail(String email);
    Optional<Technician> getTechnicianByPhone(String phone);
    List<Technician> getTechnicianByName(String name);
    List<Technician> getTechnicianBySpecialization(String specialization, ServiceCenter center);
}
