package com.karostartup.internship.config;

import com.karostartup.internship.model.*;
import com.karostartup.internship.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private InternshipRepository internshipRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Seed default admin if not present
        if (!adminRepository.findByUsername("admin").isPresent()) {
            Admin admin = new Admin();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setName("KaroStartup Admin");
            adminRepository.save(admin);
            System.out.println("✅ DataSeeder: Admin user 'admin' created.");
        }

        if (companyRepository.count() == 0) {
            Company techflit = new Company();
            techflit.setName("TechFlit");
            techflit.setEmail("hr@techflit.com");
            techflit.setPassword(passwordEncoder.encode("tech123"));
            techflit.setDescription("Innovative tech solutions provider.");
            techflit.setLogoUrl("/partners/techflit.png");
            companyRepository.save(techflit);

            Company eduvibe = new Company();
            eduvibe.setName("EduVibe");
            eduvibe.setEmail("hr@eduvibe.com");
            eduvibe.setPassword(passwordEncoder.encode("edu123"));
            eduvibe.setDescription("Next-gen education platform.");
            eduvibe.setLogoUrl("/partners/eduvibe.png");
            companyRepository.save(eduvibe);

            Company greenroot = new Company();
            greenroot.setName("GreenRoot");
            greenroot.setEmail("hr@greenroot.com");
            greenroot.setPassword(passwordEncoder.encode("green123"));
            greenroot.setDescription("Sustainable environment solutions.");
            greenroot.setLogoUrl("/partners/greenroot.png");
            companyRepository.save(greenroot);

            Company healthsync = new Company();
            healthsync.setName("HealthSync");
            healthsync.setEmail("hr@healthsync.com");
            healthsync.setPassword(passwordEncoder.encode("health123"));
            healthsync.setDescription("Integrated healthcare management.");
            healthsync.setLogoUrl("/partners/healthsync.png");
            companyRepository.save(healthsync);

            System.out.println("✅ DataSeeder: Hiring partners created.");

            if (internshipRepository.count() == 0) {
                Internship dev = new Internship();
                dev.setTitle("React Frontend Dev Intern");
                dev.setCompanyName("TechFlit");
                dev.setLocation("Remote");
                dev.setStipend("₹15,000 / month");
                dev.setDescription("Looking for a passionate React developer intern to build beautiful, responsive modern UIs.");
                dev.setCompany(techflit);
                
                Internship backend = new Internship();
                backend.setTitle("Backend Engineer (Java) Intern");
                backend.setCompanyName("EduVibe");
                backend.setLocation("Bangalore");
                backend.setStipend("₹20,000 / month");
                backend.setDescription("Help us scale our core microservices using Spring Boot.");
                backend.setCompany(eduvibe);

                internshipRepository.save(dev);
                internshipRepository.save(backend);
                
                System.out.println("✅ DataSeeder: Base internships created and linked to partners.");

                // Seed sample applications
                Student student1 = new Student();
                student1.setName("Ankit Kumar");
                student1.setEmail("ankit@test.com");
                student1.setMobile("9876543210");
                student1.setSkills("React, JS, CSS");
                student1.setResumeUrl("https://example.com/resume.pdf");
                studentRepository.save(student1);

                Application app1 = new Application();
                app1.setStudent(student1);
                app1.setInternship(dev);
                app1.setStatus("PENDING");
                applicationRepository.save(app1);

                System.out.println("✅ DataSeeder: Sample applications created.");
            }
        }
    }
}
