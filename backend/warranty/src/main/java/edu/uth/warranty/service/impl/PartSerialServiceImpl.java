package edu.uth.warranty.service.impl;

import edu.uth.warranty.model.PartSerial;
import edu.uth.warranty.model.Part;
import edu.uth.warranty.repository.PartSerialRepository;
import edu.uth.warranty.repository.PartRepository;
import edu.uth.warranty.service.IPartSerialService;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class PartSerialServiceImpl implements IPartSerialService{
    private final PartSerialRepository partSerialRepository;
    private final PartRepository partRepository;

    public PartSerialServiceImpl(PartSerialRepository partSerialRepository, PartRepository partRepository) {
        this.partSerialRepository = partSerialRepository;
        this.partRepository = partRepository;
    }

    @Override
    public List<PartSerial> getAllPartSerials() {
        return partSerialRepository.findAll();
    }

    @Override
    public Optional<PartSerial> getPartSerialById(Long id) {
        return partSerialRepository.findById(id);
    }

    @Override
    public PartSerial savePartSerial(PartSerial partSerial) {
        //Kiểm tra Part (Linh kiện) có tồn tại không (FK validation)
        if (partSerial.getPart() == null || partSerial.getPart().getPart_id() == null || 
            partRepository.findById(partSerial.getPart().getPart_id()).isEmpty()) {
            throw new IllegalArgumentException("Linh kiện (Part) liên kết không tồn tại hoặc không hợp lệ.");
        }
        
        //Kiểm tra tính duy nhất của Serial Number
        String serialNumber = partSerial.getSerialNumber();
        Optional<PartSerial> existingBySerial = partSerialRepository.findBySerialNumber(serialNumber);

        if (existingBySerial.isPresent()) {
            // Nếu serial đã tồn tại, chỉ cho phép cập nhật nếu đó là cùng một bản ghi
            if (partSerial.getPart_serial_id() == null || !partSerial.getPart_serial_id().equals(existingBySerial.get().getPart_serial_id())) {
                throw new IllegalArgumentException("Số Serial đã tồn tại trong hệ thống.");
            }
        }
        
        return partSerialRepository.save(partSerial);
    }

    @Override
    public void deletePartSerial(Long id) {
        partSerialRepository.deleteById(id);
    }

    @Override
    public Optional<PartSerial> getPartSerialBySerialNumber(String serialNumber) {
        return partSerialRepository.findBySerialNumber(serialNumber);
    }

    @Override
    public Boolean isSerialNumberUnique(String serialNumber) {
        return partSerialRepository.existsBySerialNumber(serialNumber);
    }

    @Override
    public List<PartSerial> getPartSerialsByPart(Part part) {
        return partSerialRepository.findByPart(part);
    }

    @Override
    public List<PartSerial> getPartSerialsByDateReceivedBetween(LocalDate startDate, LocalDate endDate) {
        return partSerialRepository.findByDateReceivedBetween(startDate, endDate);
    }

}
