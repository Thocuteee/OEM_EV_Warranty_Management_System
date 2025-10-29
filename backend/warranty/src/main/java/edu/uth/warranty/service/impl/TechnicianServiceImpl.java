package edu.uth.warranty.service.impl;

import edu.uth.warranty.model.Technician;
import edu.uth.warranty.repository.TechnicianRepository;
import edu.uth.warranty.service.ITechnicianService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class TechnicianServiceImpl implements ITechnicianService {

    private final TechnicianRepository repo;
    private final PasswordEncoder encoder;

    public TechnicianServiceImpl(TechnicianRepository repo, PasswordEncoder encoder) {
        this.repo = repo;
        this.encoder = encoder;
    }

    @Override
    public Optional<Technician> findByEmail(String email) {
        return repo.findByEmail(email);
    }

    @Override
    public Optional<Technician> authenticate(String email, String password) {
        return repo.findByEmail(email)
                   .filter(t -> encoder.matches(password, t.getPassword()));
    }
}
