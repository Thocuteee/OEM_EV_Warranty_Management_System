package edu.uth.warranty.service.impl;

import edu.uth.warranty.model.Inventory;
import edu.uth.warranty.model.Part;
import edu.uth.warranty.model.ServiceCenter;
import edu.uth.warranty.repository.InventoryRepository;
import edu.uth.warranty.repository.PartRepository;
import edu.uth.warranty.repository.ServiceCenterRepository;
import edu.uth.warranty.service.IInventoryService;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class InventoryServiceImpl implements IInventoryService{
    private final InventoryRepository inventoryRepository;
    private final PartRepository partRepository;
    private final ServiceCenterRepository centerRepository;

    public InventoryServiceImpl(
        InventoryRepository inventoryRepository,
        PartRepository partRepository,
        ServiceCenterRepository centerRepository) {
        
        this.inventoryRepository = inventoryRepository;
        this.partRepository = partRepository;
        this.centerRepository = centerRepository;
    }

    @Override
    public List<Inventory> getAllInventoryRecords() {
        return inventoryRepository.findAll();
    }

    @Override
    public Optional<Inventory> getInventoryById(Long id) {
        return inventoryRepository.findById(id);
    }

    @Override
    public Inventory saveInventory(Inventory inventory) {
        //Kiểm tra Khóa Ngoại (FK) có tồn tại không
        if (inventory.getPart() == null || inventory.getPart().getPart_id() == null || 
            partRepository.findById(inventory.getPart().getPart_id()).isEmpty()) {
            throw new IllegalArgumentException("Linh kiện không tồn tại hoặc không hợp lệ.");
        }
        if (inventory.getCenter() == null || inventory.getCenter().getCenter_id() == null || 
            centerRepository.findById(inventory.getCenter().getCenter_id()).isEmpty()) {
            throw new IllegalArgumentException("Trung tâm Dịch vụ không tồn tại hoặc không hợp lệ.");
        }
        
        //Đảm bảo chỉ có một bản ghi tồn kho duy nhất cho mỗi cặp (Part, Center)
        Optional<Inventory> existingInventory = inventoryRepository.findByPartAndCenter(inventory.getPart(), inventory.getCenter());

        if (existingInventory.isPresent()) {
            // Nếu là bản ghi cũ, update ID của object mới để JPA biết đây là update
            if (inventory.getInventory_id() == null) {
                inventory.setInventory_id(existingInventory.get().getInventory_id());
            }
        } else if (inventory.getInventory_id() != null) {
            // Nếu có ID nhưng không tìm thấy bản ghi cũ (người dùng cố tình cập nhật bản ghi không tồn tại)
            throw new IllegalArgumentException("Không thể cập nhật bản ghi tồn kho không tồn tại.");
        }
        
        return inventoryRepository.save(inventory);
    }

    @Override
    public void deleteInventory(Long id) {
        inventoryRepository.deleteById(id);
    }

    @Override
    public Optional<Inventory> getInventoryByPartAndCenter(Part part, ServiceCenter center) {
        return inventoryRepository.findByPartAndCenter(part, center);
    }

    @Override
    public List<Inventory> getInventoryByPart(Part part) {
        return inventoryRepository.findByPart(part);
    }

    @Override
    public List<Inventory> getInventoryByCenter(ServiceCenter center) {
        return inventoryRepository.findByCenter(center);
    }

    @Override
    public List<Inventory> getInventoryForReStock(BigDecimal amount) {
        return inventoryRepository.findByAmountLessThanEqual(amount);
    }

    @Override
    public List<Inventory> getInventoryByInvoiceDateBetween(LocalDate startDate, LocalDate endDate) {
        return inventoryRepository.findByInvoiceDateBetween(startDate, endDate);
    }
}
