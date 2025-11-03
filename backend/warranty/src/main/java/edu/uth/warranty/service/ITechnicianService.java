package edu.uth.warranty.service;

import edu.uth.warranty.model.Technician;
import edu.uth.warranty.model.ServiceCenter;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

@Service
public interface ITechnicianService {
    List<Technician> getAllTechnicians();
    Optional<Technician> getTechnicianById(Long id);

    Technician saveTechnician(Technician technician);
    
    void deleteTechnician(Long id);

    Optional<Technician> getTechnicianByName(String name);

    Optional<Technician> getTechnicianByEmail(String email);

    Optional<Technician> getTechnicianByPhone(String phone);

    List<Technician> getTechniciansByCenter(ServiceCenter center);

    List<Technician> getTechniciansBySpecialization(String specialization);

    List<Technician> getTechniciansBySpecializationAndCenter(String specialization, ServiceCenter center);
    Technician save(Technician technician);
    List<Technician> findByCenter(Long centerId);
}
