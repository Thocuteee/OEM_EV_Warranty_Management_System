package edu.uth.warranty.service.impl;

import edu.uth.warranty.model.ServiceCenter;
import edu.uth.warranty.repository.InvoiceRepository;
import edu.uth.warranty.repository.ServiceCenterRepository;
import edu.uth.warranty.service.IServiceCenterService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ServiceCenterServiceImpl implements IServiceCenterService {

    private final ServiceCenterRepository serviceCenterRepository;

    public ServiceCenterServiceImpl(ServiceCenterRepository serviceCenterRepository) {
        this.serviceCenterRepository = serviceCenterRepository;
    }

    @Override
    public List<ServiceCenter> getAllServiceCenters() {
        return serviceCenterRepository.findAll();
    }

    @Override
    public Optional<ServiceCenter> getServiceCenterById(Long id) {
        return serviceCenterRepository.findById(id);
    }

    @Override
    public ServiceCenter saveServiceCenter(ServiceCenter center) {
       //tránh trùng tên
        Optional<ServiceCenter> existing = serviceCenterRepository.findByName(center.getName());
        if (existing.isPresent() && !existing.get().getCenter_id().equals(center.getCenter_id())) {
            throw new IllegalArgumentException("Service Center name already exists: " + center.getName());
        }
        return serviceCenterRepository.save(center);
    }

    @Autowired// tránh xóa trung tâm khi còn hóa đơn
    private InvoiceRepository invoiceRepository;

    @Override
    public void deleteServiceCenter(Long id) {
        ServiceCenter center = serviceCenterRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Service Center not found"));
        
        if (!invoiceRepository.findByCenter(center).isEmpty()) {
            throw new IllegalStateException("Cannot delete Service Center with existing invoices");
        }

        serviceCenterRepository.delete(center);
    }

    @Override
    public Optional<ServiceCenter> getServiceCenterByName(String name) {
        return serviceCenterRepository.findByName(name);
    }

    @Override
    public List<ServiceCenter> getServiceCentersByLocation(String location) {
        return serviceCenterRepository.findByLocation(location);
    }
}
