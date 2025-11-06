package edu.uth.warranty.service.impl;

import edu.uth.warranty.model.VehiclePartHistory;
import edu.uth.warranty.model.Vehicle;
import edu.uth.warranty.model.PartSerial;
import edu.uth.warranty.model.WarrantyClaim;
import edu.uth.warranty.repository.VehiclePartHistoryRepository;
import edu.uth.warranty.repository.VehicleRepository;
import edu.uth.warranty.repository.PartSerialRepository;
import edu.uth.warranty.repository.WarrantyClaimRepository;
import edu.uth.warranty.service.IVehiclePartHistoryService;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class VehiclePartHistoryServiceImpl implements IVehiclePartHistoryService{
    private final VehiclePartHistoryRepository historyRepository;
    private final VehicleRepository vehicleRepository;
    private final PartSerialRepository partSerialRepository;
    private final WarrantyClaimRepository claimRepository;

    public VehiclePartHistoryServiceImpl(
        VehiclePartHistoryRepository historyRepository,
        VehicleRepository vehicleRepository,
        PartSerialRepository partSerialRepository,
        WarrantyClaimRepository claimRepository) {
        
        this.historyRepository = historyRepository;
        this.vehicleRepository = vehicleRepository;
        this.partSerialRepository = partSerialRepository;
        this.claimRepository = claimRepository;
    }

    @Override
    public List<VehiclePartHistory> getAllHistoryRecords() {
        return historyRepository.findAll();
    }

    @Override
    public Optional<VehiclePartHistory> getHistoryRecordById(Long id) {
        return historyRepository.findById(id);
    }

    @Override
    public VehiclePartHistory saveHistoryRecord(VehiclePartHistory record) {
        //Kiểm tra Khóa Ngoại (FK) phải tồn tại
        if (record.getVehicle() == null || vehicleRepository.findById(record.getVehicle().getVehicleId()).isEmpty()) {
            throw new IllegalArgumentException("Vehicle (Xe) không tồn tại.");
        }
        if (record.getPartserial() == null || partSerialRepository.findById(record.getPartserial().getPart_serial_id()).isEmpty()) {
            throw new IllegalArgumentException("Part Serial (Số serial linh kiện) không tồn tại.");
        }
        if (record.getClaim() == null || claimRepository.findById(record.getClaim().getWarrantyClaimId()).isEmpty()) {
            throw new IllegalArgumentException("Warranty Claim không tồn tại.");
        }

        //Thiết lập ngày lắp đặt nếu không có
        if (record.getDateInstalled() == null) {
            record.setDateInstalled(LocalDate.now());
        }
        
        return historyRepository.save(record);
    }

    @Override
    public void deleteHistoryRecord(Long id) {
        historyRepository.deleteById(id);
    }

    // --- NGHIỆP VỤ TÌM KIẾM ---
    
    @Override
    public List<VehiclePartHistory> getHistoryByVehicle(Vehicle vehicle) {
        return historyRepository.findByVehicle(vehicle);
    }

    @Override
    public List<VehiclePartHistory> getHistoryByPartSerial(PartSerial partserial) {
        return historyRepository.findByPartserial(partserial);
    }

    @Override
    public List<VehiclePartHistory> getHistoryByClaim(WarrantyClaim claim) {
        return historyRepository.findByClaim(claim);
    }

    @Override
    public List<VehiclePartHistory> getHistoryByDateInstalledBetween(LocalDate startDate, LocalDate endDate) {
        return historyRepository.findByDateInstalledBetween(startDate, endDate);
    }

}
