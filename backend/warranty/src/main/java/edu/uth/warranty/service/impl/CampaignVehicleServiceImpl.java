package edu.uth.warranty.service.impl;

import edu.uth.warranty.model.CampaignVehicle;
import edu.uth.warranty.model.Customer;
import edu.uth.warranty.model.RecallCampaign;
import edu.uth.warranty.model.Vehicle;

import edu.uth.warranty.repository.CampaignVehicleRepository;
import edu.uth.warranty.repository.RecallCampaignRepository;
import edu.uth.warranty.repository.VehicleRepository;
import edu.uth.warranty.repository.CustomerRepository;
import edu.uth.warranty.service.ICampaignVehicleService;
import edu.uth.warranty.service.EmailNotificationService;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class CampaignVehicleServiceImpl implements ICampaignVehicleService{
    private final CampaignVehicleRepository campaignVehicleRepository;
    private final RecallCampaignRepository recallCampaignRepository;
    private final VehicleRepository vehicleRepository;
    private final CustomerRepository customerRepository; 
    private final EmailNotificationService notificationService;

    public CampaignVehicleServiceImpl(CampaignVehicleRepository campaignVehicleRepository, RecallCampaignRepository recallCampaignRepository,VehicleRepository vehicleRepository,CustomerRepository customerRepository, EmailNotificationService notificationService) {
        this.campaignVehicleRepository = campaignVehicleRepository;
        this.recallCampaignRepository = recallCampaignRepository;
        this.vehicleRepository = vehicleRepository;
        this.customerRepository = customerRepository;
        this.notificationService = notificationService;
    }

    @Override
    public List<CampaignVehicle> getAllCampaignVehicle() {
        return campaignVehicleRepository.findAll();
    }

    @Override
    public Optional<CampaignVehicle> getCampaignVehicleById(Long campaignId, Long vehicleId) {
        CampaignVehicle.CampaignVehicleId id = new CampaignVehicle.CampaignVehicleId(campaignId, vehicleId);
        return campaignVehicleRepository.findById(id);
    }

    @Override
    public CampaignVehicle saveCampaignVehicle(CampaignVehicle entity) {
        Long campaignId = entity.getRecallCampaignEntity().getCampaignId();
        Long vehicleId = entity.getVehicleEntity().getVehicleId();
        
        // 1. Kiểm tra tồn tại và Lấy Entity đầy đủ
        RecallCampaign campaign = recallCampaignRepository.findById(campaignId)
            .orElseThrow(() -> new IllegalArgumentException("Chiến dịch triệu hồi không tồn tại."));
            
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
            .orElseThrow(() -> new IllegalArgumentException("Xe không tồn tại."));
        
        // Cập nhật Entity với thông tin đầy đủ
        entity.setRecallCampaignEntity(campaign);
        entity.setVehicleEntity(vehicle);

        // 2. Kiểm tra khách hàng và gửi thông báo
        System.out.println("=== KIỂM TRA KHÁCH HÀNG ĐỂ GỬI EMAIL ===");
        System.out.println("Vehicle ID: " + vehicleId);
        System.out.println("Vehicle có Customer không: " + (vehicle.getCustomer() != null));
        
        if (vehicle.getCustomer() != null) {
            Long customerId = vehicle.getCustomer().getCustomerId();
            System.out.println("Customer ID: " + customerId);
            
            Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new IllegalArgumentException("Khách hàng không tồn tại."));
            
            System.out.println("Customer Name: " + customer.getName());
            System.out.println("Customer Email: " + customer.getEmail());
            
            // *** KÍCH HOẠT GỬI EMAIL ***
            try {
                notificationService.sendCampaignNotification(customer, vehicle, campaign);
            } catch (Exception e) {
                System.err.println("⚠️ Lỗi khi gửi email (nhưng vẫn tiếp tục lưu CampaignVehicle): " + e.getMessage());
                e.printStackTrace();
            }
            // ***************************
        } else {
            System.out.println("⚠️ Vehicle không có Customer, bỏ qua gửi email.");
        }
        System.out.println("=== KẾT THÚC KIỂM TRA KHÁCH HÀNG ===");

        // 3. Lưu bản ghi CampaignVehicle
        return campaignVehicleRepository.save(entity);
    }

    @Override
    public void deleteCampaignVehicle(Long campaignId, Long vehicleId) {
        CampaignVehicle.CampaignVehicleId id = new CampaignVehicle.CampaignVehicleId(campaignId, vehicleId);
        campaignVehicleRepository.deleteById(id);
    }

    @Override
    public List<CampaignVehicle> getCampaignVehiclesByCampaign(RecallCampaign campaign) {
        return campaignVehicleRepository.findByRecallCampaignEntity(campaign);
    }

    @Override
    public List<CampaignVehicle> getCampaignsByVehicle(Vehicle vehicle) {
        return campaignVehicleRepository.findByVehicleEntity(vehicle);
    }

    @Override
    public List<CampaignVehicle> getCampaignVehiclesByStatus(String status) {
        return campaignVehicleRepository.findByStatus(status);
    }




}