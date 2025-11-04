package edu.uth.warranty.service.impl;

import edu.uth.warranty.model.ServiceCenter;
import edu.uth.warranty.repository.ServiceCenterRepository;
import edu.uth.warranty.service.IServiceCenterService;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ServiceCenterServiceImpl implements IServiceCenterService{
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
        //Kiểm tra tính duy nhất của Tên Trung tâm
        Optional<ServiceCenter> existingCenter = serviceCenterRepository.findByName(center.getName());

        if (existingCenter.isPresent()) {
            // Nếu tên đã tồn tại, chỉ cho phép cập nhật nếu đó là cùng một bản ghi (sửa)
            if (center.getCenter_id() == null || !center.getCenter_id().equals(existingCenter.get().getCenter_id())) {
                throw new IllegalArgumentException("Tên trung tâm dịch vụ đã tồn tại.");
            }
        }
        
        return serviceCenterRepository.save(center);
    }

    @Override
    public void deleteServiceCenter(Long id) {
        serviceCenterRepository.deleteById(id);
    }
    
    @Override
    public Optional<ServiceCenter> getServiceCenterByName(String name) {
        return serviceCenterRepository.findByName(name);
    }

    @Override
    public List<ServiceCenter> getServiceCentersByLocation(String location) {
        return serviceCenterRepository.findByLocation(location);
    }
    
    @Override
    public Boolean isNameUnique(String name) {
        return serviceCenterRepository.existsByName(name);
    }
}
