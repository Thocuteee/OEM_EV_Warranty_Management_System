package edu.uth.warranty.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.uth.warranty.dto.MessageResponse;
import edu.uth.warranty.model.Technician;
import edu.uth.warranty.service.ITechnicianService;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/technicians")
public class TechnicianController {

    private final ITechnicianService technicianService;

    @Autowired
    public TechnicianController(ITechnicianService technicianService) {
        this.technicianService = technicianService;
    }
    
    @GetMapping("/center/{id}")
    public ResponseEntity<?> getTechniciansByCenter(@PathVariable("id") Long centerId) {
        var technicians = technicianService.findByCenter(centerId);

        if (technicians == null || technicians.isEmpty()) {
            return ResponseEntity.status(404)
                    .body(new MessageResponse("Không tìm thấy kỹ thuật viên nào tại trung tâm ID = " + centerId));
        }

        return ResponseEntity.ok(technicians);
    }
       
    @PostMapping
    public ResponseEntity<?> addTechnician(@RequestBody Technician technician) {
        Technician saved = technicianService.save(technician);
        return ResponseEntity.ok(new MessageResponse("Đã thêm kỹ thuật viên: " + saved.getName()));
    }
}
