package edu.uth.warranty.repository;

import edu.uth.warranty.model.Invoice;
import edu.uth.warranty.model.ServiceCenter;
import edu.uth.warranty.model.WarrantyClaim;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long>{
    



}
