package edu.uth.warranty.service;

<<<<<<< HEAD
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
=======
<<<<<<< HEAD
import java.util.Optional;

import edu.uth.warranty.model.Technician;

public interface ITechnicianService {
    Optional<Technician> findTechnicianByEmail(String email);
    Optional<Technician> authenticateTechnician(String email, String password);
}
=======
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
>>>>>>> 2524f509a70da6fae00d0769f913b1b39a0d5d41
}
>>>>>>> main
