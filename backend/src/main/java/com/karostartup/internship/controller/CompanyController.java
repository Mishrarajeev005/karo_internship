package com.karostartup.internship.controller;

import com.karostartup.internship.model.Company;
import com.karostartup.internship.repository.CompanyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/companies")
public class CompanyController {

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private com.karostartup.internship.security.JwtUtil jwtUtil;

    @Autowired
    private com.karostartup.internship.security.CustomUserDetailsService userDetailsService;

    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    // Create a new company (Only Super Admin should ideally do this)
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Company company) {
        if (companyRepository.findByEmail(company.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already registered");
        }
        company.setPassword(passwordEncoder.encode(company.getPassword()));
        return ResponseEntity.ok(companyRepository.save(company));
    }

    // Company Login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        Optional<Company> companyOpt = companyRepository.findByEmail(email);
        if (companyOpt.isPresent() && passwordEncoder.matches(password, companyOpt.get().getPassword())) {
            final org.springframework.security.core.userdetails.UserDetails userDetails = userDetailsService.loadUserByUsername(email);
            final String jwt = jwtUtil.generateToken(userDetails);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("token", jwt);
            response.put("company", companyOpt.get());
            return ResponseEntity.ok(response);
        }

        return ResponseEntity.status(401).body("Invalid email or password");
    }

    @GetMapping
    public List<Company> getAllCompanies() {
        return companyRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Company> getCompanyById(@PathVariable Long id) {
        return companyRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/toggle-status")
    public ResponseEntity<Company> toggleStatus(@PathVariable Long id) {
        return companyRepository.findById(id).map(company -> {
            company.setActive(!company.isActive());
            return ResponseEntity.ok(companyRepository.save(company));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Company> updateCompany(@PathVariable Long id, @RequestBody Company companyDetails) {
        return companyRepository.findById(id).map(company -> {
            company.setName(companyDetails.getName());
            company.setEmail(companyDetails.getEmail());
            if (companyDetails.getPassword() != null && !companyDetails.getPassword().isEmpty()) {
                company.setPassword(passwordEncoder.encode(companyDetails.getPassword()));
            }
            company.setDescription(companyDetails.getDescription());
            company.setLogoUrl(companyDetails.getLogoUrl());
            return ResponseEntity.ok(companyRepository.save(company));
        }).orElse(ResponseEntity.notFound().build());
    }
}
