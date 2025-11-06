package edu.uth.warranty.service.impl;

import edu.uth.warranty.model.Technician;
import edu.uth.warranty.model.ServiceCenter;
import edu.uth.warranty.repository.TechnicianRepository;
import edu.uth.warranty.repository.ServiceCenterRepository;
import edu.uth.warranty.service.ITechnicianService;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

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

    @Override
    public Technician saveTechnician(Technician technician) {
        if (technician.getCenter() == null || technician.getCenter().getCenterId() == null) {
            throw new IllegalArgumentException("Kỹ thuật viên phải được gán cho một Trung tâm Dịch vụ hợp lệ.");
        }
        if (serviceCenterRepository.findById(technician.getCenter().getCenterId()).isEmpty()) {
            throw new IllegalArgumentException("Trung tâm dịch vụ không tồn tại.");
        }
        Optional<Technician> existingByEmail = technicianRepository.findByEmail(technician.getEmail());
        if (existingByEmail.isPresent() && (technician.getTechnicianId() == null || !technician.getTechnicianId().equals(existingByEmail.get().getTechnicianId()))) {
            throw new IllegalArgumentException("Email đã tồn tại.");
        }

        Optional<Technician> existingByPhone = technicianRepository.findByPhone(technician.getPhone());
        if (existingByPhone.isPresent() && (technician.getTechnicianId() == null || !technician.getTechnicianId().equals(existingByPhone.get().getTechnicianId()))) {
            throw new IllegalArgumentException("Số điện thoại đã tồn tại.");
        }
        
        return technicianRepository.save(technician);
    }

    @Override
    public void deleteTechnician(Long id) {
        technicianRepository.deleteById(id);
    }

    @Override
    public Optional<Technician> getTechnicianByName(String name) {
        return technicianRepository.findByName(name);
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
    public List<Technician> getTechniciansByCenter(ServiceCenter center) {
        return technicianRepository.findByCenter(center);
    }

    @Override
    public List<Technician> getTechniciansBySpecialization(String specialization) {
        return List.of();
    }

    @Override
    public List<Technician> getTechniciansBySpecializationAndCenter(String specialization, ServiceCenter center) {
        return technicianRepository.findBySpecializationAndCenter(specialization, center);
    }
}
