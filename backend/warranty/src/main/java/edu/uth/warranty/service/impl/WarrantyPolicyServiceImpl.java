package edu.uth.warranty.service.impl;

import edu.uth.warranty.model.WarrantyPolicy;
import edu.uth.warranty.repository.WarrantyPolicyRepository;
import edu.uth.warranty.service.IWarrantyPolicyService;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
}

