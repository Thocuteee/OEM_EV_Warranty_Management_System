package edu.uth.warranty.service;

import edu.uth.warranty.model.ServiceCenter;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

@Service
public interface IServiceCenterService {
    // Lấy tất cả các trung tâm
    List<ServiceCenter> getAllServiceCenters();
    // Lấy trung tâm theo ID
    Optional<ServiceCenter> getServiceCenterById(Long id);
    // Lưu hoặc cập nhật trung tâm
    ServiceCenter saveServiceCenter(ServiceCenter serviceCenter);
    // Xóa trung tâm theo ID
    void deleteServiceCenter(Long id);
    // Tìm trung tâm theo tên
    Optional<ServiceCenter> getServiceCenterByName(String name);
    // Tìm các trung tâm theo địa điểm
    List<ServiceCenter> getServiceCentersByLocation(String location);
}
