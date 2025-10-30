package edu.uth.warranty.service.impl;

import edu.uth.warranty.model.RecallCampaign;
import edu.uth.warranty.repository.RecallCampaignRepository;
import edu.uth.warranty.service.IRecallCampaignService;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;


@Service
@Transactional
public class RecallCampaignImpl implements IRecallCampaignService{
    private final RecallCampaignRepository recallCampaignRepository;

    public RecallCampaignImpl(RecallCampaignRepository recallCampaignRepository) {
        this.recallCampaignRepository = recallCampaignRepository;
    }

    @Override
    public List<RecallCampaign> getAllCampaign() {
        return recallCampaignRepository.findAll();
    }

    @Override
    public Optional<RecallCampaign> getCampaignById(Long id) {
        return recallCampaignRepository.findById(id);
    }

    public RecallCampaign recallCampaign(RecallCampaign recallCampaign) {
        // Kiểm tra tính hợp lệ của ngày tháng (StartDate phải trước EndDate
        if(recallCampaign.getStartDate() != null && recallCampaign.getEndDate() != null && recallCampaign.getStartDate().isAfter(recallCampaign.getEndDate())) {
            throw new IllegalArgumentException("Ngày bắt đầu phải trước ngày kết thúc của Chiến dịch.");
        }

        // Kiểm tra trùng tên
        Optional<RecallCampaign> existingCampaign = recallCampaignRepository.findByTitle(recallCampaign.getTitle());
        if(existingCampaign.isPresent() && (recallCampaign.getCampaign_id() == null || !recallCampaign.getCampaign_id().equals(existingCampaign.get().getCampaign_id()))) {
            throw new IllegalArgumentException("Tiêu đề Chiến dịch đã tồn tại.");
        }
        return recallCampaignRepository.save(recallCampaign);
    }

    @Override
    public void deleteCampaign(Long id) {
        recallCampaignRepository.deleteById(id);
    }

    @Override
    public Optional<RecallCampaign> getCampaignByTitle(String title) {
        return recallCampaignRepository.findByTitle(title);
    }

    @Override
    public List<RecallCampaign> getActiveCampaign(LocalDate date) {
        return recallCampaignRepository.findByStartDateLessThanEqualAndEndDateGreaterThanEqual(date, date);
    }

    @Override
    public List<RecallCampaign> getCampaignsByStartDateBetween(LocalDate startDate, LocalDate endDate) {
        return recallCampaignRepository.findByStartDateBetween(startDate, endDate);
    }
    
}
