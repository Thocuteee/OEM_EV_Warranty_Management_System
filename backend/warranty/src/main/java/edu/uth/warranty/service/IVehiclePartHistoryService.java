package edu.uth.warranty.service;

import java.util.List;

import edu.uth.warranty.model.VehiclePartHistory;

public interface IVehiclePartHistoryService {
    List<VehiclePartHistory> findByVehicleId(Long vehicleId);
    List<VehiclePartHistory> findByPartId(Long partId);
}
