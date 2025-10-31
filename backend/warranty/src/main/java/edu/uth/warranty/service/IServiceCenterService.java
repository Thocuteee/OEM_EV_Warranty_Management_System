package edu.uth.warranty.service;

import edu.uth.warranty.model.ServiceCenter;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

@Service
public interface IServiceCenterService {
    List<ServiceCenter> getAllServiceCenters();
    Optional<ServiceCenter> getServiceCenterById(Long id);

    ServiceCenter saveServiceCenter(ServiceCenter center);
    
    void deleteServiceCenter(Long id);

    Optional<ServiceCenter> getServiceCenterByName(String name);

    List<ServiceCenter> getServiceCentersByLocation(String location);

    Boolean isNameUnique(String name);
}
