package com.karostartup.internship.controller;

import com.karostartup.internship.model.Admin;
import com.karostartup.internship.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private com.karostartup.internship.security.JwtUtil jwtUtil;

    @Autowired
    private com.karostartup.internship.security.CustomUserDetailsService userDetailsService;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    // Login endpoint
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");

        Optional<Admin> adminOpt = adminRepository.findByUsername(username);
        if (adminOpt.isPresent()) {
            Admin dbAdmin = adminOpt.get();
            if (passwordEncoder.matches(password, dbAdmin.getPassword())) {
                final org.springframework.security.core.userdetails.UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                final String jwt = jwtUtil.generateToken(userDetails);

                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Login successful");
                response.put("token", jwt);
                response.put("admin", dbAdmin);
                return ResponseEntity.ok(response);
            }
        }

        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("message", "Invalid username or password");
        return ResponseEntity.status(401).body(response);
    }

    // Verify admin exists (for forgot password)
    @PostMapping("/verify-username")
    public ResponseEntity<?> verifyUsername(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        Optional<Admin> adminOpt = adminRepository.findByUsername(username);

        Map<String, Object> response = new HashMap<>();
        if (adminOpt.isPresent()) {
            response.put("success", true);
            response.put("message", "Username verified. You can now reset your password.");
        } else {
            response.put("success", false);
            response.put("message", "No admin account found with this username.");
        }
        return ResponseEntity.ok(response);
    }

    // Reset password
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String newPassword = body.get("newPassword");

        Optional<Admin> adminOpt = adminRepository.findByUsername(username);
        Map<String, Object> response = new HashMap<>();

        if (adminOpt.isPresent()) {
            Admin admin = adminOpt.get();
            admin.setPassword(passwordEncoder.encode(newPassword));
            adminRepository.save(admin);
            response.put("success", true);
            response.put("message", "Password has been reset successfully!");
        } else {
            response.put("success", false);
            response.put("message", "Admin not found.");
        }
        return ResponseEntity.ok(response);
    }

    // Forgot Username
    @PostMapping("/forgot-username")
    public ResponseEntity<?> forgotUsername(@RequestBody Map<String, String> body) {
        String name = body.get("name");
        Optional<Admin> adminOpt = adminRepository.findAll().stream()
                .filter(a -> a.getName().equalsIgnoreCase(name))
                .findFirst();

        Map<String, Object> response = new HashMap<>();
        if (adminOpt.isPresent()) {
            response.put("success", true);
            response.put("username", adminOpt.get().getUsername());
        } else {
            response.put("success", false);
            response.put("message", "No admin account found with this name.");
        }
        return ResponseEntity.ok(response);
    }
}
