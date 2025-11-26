package edu.uth.warranty.service.impl;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.uth.warranty.model.Vehicle;
import edu.uth.warranty.model.WarrantyPolicy;
import edu.uth.warranty.repository.WarrantyPolicyRepository;
import edu.uth.warranty.service.IWarrantyPolicyService;

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
        Optional<WarrantyPolicy> existing = policyRepository.findByPolicyName(policy.getPolicyName());
        if (existing.isPresent()) {
            if (policy.getPolicyId() == null || !policy.getPolicyId().equals(existing.get().getPolicyId())) {
                throw new IllegalArgumentException("Tên chính sách bảo hành đã tồn tại.");
            }
        }
        return policyRepository.save(policy);
    }

    @Override
    public void deletePolicy(Long id) {
        policyRepository.deleteById(id);
    }

    @Override
    public void checkWarrantyValidity(Vehicle vehicle) {
        // 1. Lấy chính sách (Logic đơn giản: lấy cái đầu tiên tìm thấy)
        List<WarrantyPolicy> policies = policyRepository.findAll();
        if (policies.isEmpty()) {
            throw new IllegalArgumentException("Hệ thống chưa thiết lập Chính sách bảo hành.");
        }
        // Trong tương lai có thể map theo Model xe, tạm thời lấy phần tử đầu tiên
        WarrantyPolicy policy = policies.get(0);

        // 2. Kiểm tra ngày mua
        if (vehicle.getPurchaseDate() == null) {
            throw new IllegalArgumentException("Xe chưa có thông tin Ngày mua. Không thể kiểm tra bảo hành.");
        }

        long monthsElapsed = ChronoUnit.MONTHS.between(vehicle.getPurchaseDate(), LocalDate.now());
        if (monthsElapsed > policy.getDurationMonths()) {
            throw new IllegalArgumentException("Xe đã hết hạn bảo hành theo thời gian (" 
                + monthsElapsed + " tháng > " + policy.getDurationMonths() + " tháng).");
        }

        // 3. Kiểm tra số KM
        long mileage = vehicle.getCurrentMileage() != null ? vehicle.getCurrentMileage() : 0L;
        if (mileage > policy.getMileageLimit()) {
            throw new IllegalArgumentException("Xe đã hết hạn bảo hành theo số KM (" 
                + mileage + " km > " + policy.getMileageLimit() + " km).");
        }
    }
}