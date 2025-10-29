package edu.uth.warranty.service;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import edu.uth.warranty.model.ServiceCenter;

@Service
public interface IServiceCenterService {
    Optional<ServiceCenter> getServiceCenterByName(String name);
    Optional<ServiceCenter> getServiceCenterByLocation(String location);
    Optional<ServiceCenter> getServiceCenterById(Long id);
    List<ServiceCenter> getAllServiceCenters();
}
