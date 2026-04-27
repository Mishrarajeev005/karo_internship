package com.karostartup.internship.config;

import com.karostartup.internship.model.Admin;
import com.karostartup.internship.model.Internship;
import com.karostartup.internship.repository.AdminRepository;
import com.karostartup.internship.repository.InternshipRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private InternshipRepository internshipRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Override
    public void run(String... args) throws Exception {
        // Seed default admin
        if (adminRepository.count() == 0) {
            Admin admin = new Admin();
            admin.setUsername("admin");
            admin.setPassword("admin123");
            admin.setName("KaroStartup Admin");
            adminRepository.save(admin);
            System.out.println("✅ DataSeeder: Default admin created (admin / admin123)");
        }

        if (internshipRepository.count() == 0) {
            Internship dev = new Internship();
            dev.setTitle("React Frontend Dev Intern");
            dev.setCompanyName("KaroStartup Platforms");
            dev.setLocation("Remote");
            dev.setStipend("₹15,000 / month");
            dev.setDescription("Looking for a passionate React developer intern to build beautiful, responsive modern UIs. Experience with Vite and CSS animations is a plus.");
            
            Internship backend = new Internship();
            backend.setTitle("Backend Engineer (Java) Intern");
            backend.setCompanyName("TechNexus Pvt Ltd");
            backend.setLocation("Bangalore");
            backend.setStipend("₹20,000 / month");
            backend.setDescription("Help us scale our core microservices. We need someone enthusiastic about Spring Boot, databases, and writing optimized code.");

            Internship design = new Internship();
            design.setTitle("UI/UX Designer Intern");
            design.setCompanyName("DesignMinds");
            design.setLocation("Mumbai / Remote");
            design.setStipend("₹12,000 / month");
            design.setDescription("If you love Figma, prototyping, and creating premium web experiences, come join us! Creating design systems will be your core focus.");

            internshipRepository.save(dev);
            internshipRepository.save(backend);
            internshipRepository.save(design);
            
            System.out.println("✅ DataSeeder: Base internships have been added to the database.");
        }
    }
}
