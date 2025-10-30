package edu.uth.warranty.service;

import edu.uth.warranty.model.RecallCampaign;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

@Service
public interface IRecallCampaignService {
    List<RecallCampaign> getAllCampaign();

    Optional<RecallCampaign> getCampaignById(Long id);

    RecallCampaign recallCampaign(RecallCampaign recallCampaign);

    void deleteCampaign(Long id);

    Optional<RecallCampaign> getCampaignByTitle(String title);

    List<RecallCampaign> getActiveCampaign(LocalDate date);

    List<RecallCampaign> getCampaignsByStartDateBetween(LocalDate startDate, LocalDate endDate);
}
