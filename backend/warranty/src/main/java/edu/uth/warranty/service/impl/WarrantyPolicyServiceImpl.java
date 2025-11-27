package edu.uth.warranty.service.impl;

import edu.uth.warranty.model.Vehicle;
import edu.uth.warranty.model.WarrantyPolicy;
import edu.uth.warranty.repository.WarrantyPolicyRepository;
import edu.uth.warranty.service.IWarrantyPolicyService;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class WarrantyPolicyServiceImpl implements IWarrantyPolicyService {
    private final WarrantyPolicyRepository policyRepository;

    public WarrantyPolicyServiceImpl(WarrantyPolicyRepository policyRepository) {
        this.policyRepository = policyRepository;
    }

    @Override
    public List<WarrantyPolicy> getAllPolicies() {
        return policyRepository.findAll();
    }

    @Override
    public Optional<WarrantyPolicy> getPolicyById(Long id) {
        return policyRepository.findById(id);
    }

    @Override
    public WarrantyPolicy savePolicy(WarrantyPolicy policy) {
        // Kiểm tra tính duy nhất của policyName
        String policyName = policy.getPolicyName();
        Optional<WarrantyPolicy> existingPolicy = policyRepository.findByPolicyName(policyName);
        
        if (existingPolicy.isPresent()) {
            // Nếu policyName đã tồn tại, chỉ cho phép cập nhật nếu đó là cùng một bản ghi
            if (policy.getPolicyId() == null || !policy.getPolicyId().equals(existingPolicy.get().getPolicyId())) {
                throw new IllegalArgumentException("Tên chính sách (Policy Name) đã tồn tại.");
            }
        }

        // Validation
        if (policy.getDurationMonths() == null || policy.getDurationMonths() <= 0) {
            throw new IllegalArgumentException("Thời hạn (Duration Months) phải lớn hơn 0.");
        }
        if (policy.getMileageLimit() == null || policy.getMileageLimit() < 0) {
            throw new IllegalArgumentException("Giới hạn KM (Mileage Limit) không được âm.");
        }
        
        return policyRepository.save(policy);
    }

    @Override
    public void deletePolicy(Long id) {
        if (!policyRepository.existsById(id)) {
            throw new IllegalArgumentException("Chính sách bảo hành không tồn tại.");
        }
        policyRepository.deleteById(id);
    }
    @Override
    public void checkWarrantyValidity(Vehicle vehicle) {
        // 1. Lấy chính sách (Tạm lấy cái đầu tiên làm mặc định)
        List<WarrantyPolicy> policies = policyRepository.findAll();
        if (policies.isEmpty()) {
            // Nếu chưa có policy nào, tạm thời cho qua hoặc báo lỗi (ở đây chọn báo lỗi để ép tạo policy)
            throw new IllegalArgumentException("Hệ thống chưa có Chính sách bảo hành (Warranty Policy). Vui lòng tạo ít nhất 1 chính sách.");
        }
        WarrantyPolicy policy = policies.get(0); 

        // 2. Kiểm tra Thời gian (Duration)
        if (vehicle.getPurchaseDate() == null) {
            throw new IllegalArgumentException("Xe chưa có Ngày mua (Purchase Date). Không thể kiểm tra bảo hành.");
        }

        long monthsElapsed = ChronoUnit.MONTHS.between(vehicle.getPurchaseDate(), LocalDate.now());
        if (monthsElapsed > policy.getDurationMonths()) {
            throw new IllegalArgumentException("Xe đã hết hạn bảo hành theo thời gian (" 
                + monthsElapsed + " tháng > " + policy.getDurationMonths() + " tháng).");
        }

        // 3. Kiểm tra Số KM (Mileage)
        long mileage = vehicle.getCurrentMileage() != null ? vehicle.getCurrentMileage() : 0L;
        
        if (mileage > policy.getMileageLimit()) {
            throw new IllegalArgumentException("Xe đã vượt quá giới hạn số KM bảo hành (" 
                + mileage + " km > " + policy.getMileageLimit() + " km).");
        }
    }
}

