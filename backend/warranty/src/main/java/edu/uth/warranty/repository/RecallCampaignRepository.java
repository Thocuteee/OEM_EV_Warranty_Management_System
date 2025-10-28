package edu.uth.warranty.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.uth.warranty.model.RecallCampaign;



@Repository
public interface RecallCampaignRepository extends JpaRepository<RecallCampaign, Long> {
    Optional<RecallCampaign> findByCampaignId(Long campaignId);

    Optional<RecallCampaign> findByTitle(String title);

    List<RecallCampaign> findByStartDate(LocalDate startDate);
    List<RecallCampaign> findByEndDate(LocalDate endDate);

}
