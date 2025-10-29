package edu.uth.warranty.service;

import java.util.Optional;

import edu.uth.warranty.model.Technician;

public interface ITechnicianService {
    Optional<Technician> findTechnicianByEmail(String email);
    Optional<Technician> authenticateTechnician(String email, String password);
}