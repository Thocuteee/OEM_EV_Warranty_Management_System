package edu.uth.warranty.service.impl;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.uth.warranty.model.ServiceCenter;
import edu.uth.warranty.model.Technician;
import edu.uth.warranty.repository.ServiceCenterRepository;
import edu.uth.warranty.repository.TechnicianRepository;
import edu.uth.warranty.service.ITechnicianService;

@Service
@Transactional
public class TechnicianServiceImpl implements ITechnicianService{

    private final TechnicianRepository technicianRepository;
    private final ServiceCenterRepository serviceCenterRepository;


    public TechnicianServiceImpl(TechnicianRepository technicianRepository, ServiceCenterRepository serviceCenterRepository) {
        this.technicianRepository = technicianRepository;
        this.serviceCenterRepository = serviceCenterRepository;
    }
    @Override
    public List<Technician> getAllTechnicians() {
        return technicianRepository.findAll();
    }

    @Override
    public Optional<Technician> getTechnicianById(Long id) {
        return technicianRepository.findById(id);
    }


    public Technician saveTechnician(Technician technician) {
        return technicianRepository.save(technician);
    }

    public void deleteTechnician(Long id) {
        technicianRepository.deleteById(id);
    }

    @Override
    public Optional<Technician> getTechnicianByEmail(String email) {
        return technicianRepository.findByEmail(email);
    }

    @Override
    public Optional<Technician> getTechnicianByPhone(String phone) {
        return technicianRepository.findByPhone(phone);
    }

    @Override
    public List<Technician> getTechnicianByName(String name) {
        return technicianRepository.findByName(name);
    }

    @Override
    public List<Technician> getTechnicianBySpecialization(String specialization, ServiceCenter center) {
        return technicianRepository.findBySpecializationAndCenter(specialization, center);
        
    }
}
