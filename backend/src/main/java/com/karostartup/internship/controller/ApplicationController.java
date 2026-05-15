package com.karostartup.internship.controller;

import com.karostartup.internship.model.Application;
import com.karostartup.internship.model.Internship;
import com.karostartup.internship.model.Student;
import com.karostartup.internship.repository.ApplicationRepository;
import com.karostartup.internship.repository.InternshipRepository;
import com.karostartup.internship.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    @Autowired
    private com.karostartup.internship.service.EmailService emailService;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private InternshipRepository internshipRepository;

    @PostMapping
    public Application apply(@RequestParam Long studentId, @RequestParam Long internshipId) {
        Student student = studentRepository.findById(studentId).orElseThrow();
        Internship internship = internshipRepository.findById(internshipId).orElseThrow();

        Application app = new Application();
        app.setStudent(student);
        app.setInternship(internship);
        app.setStatus("APPLIED");
        
        Application savedApp = applicationRepository.save(app);

        // Notify Partner
        String companyEmail = (internship.getCompany() != null) ? internship.getCompany().getEmail() : "admin@karostartup.com";
        emailService.sendEmail(companyEmail, 
            "New Application for " + internship.getTitle(), 
            "Hi, " + student.getName() + " has applied for the " + internship.getTitle() + " internship.\nCheck your dashboard for details.");

        return savedApp;
    }

    @PutMapping("/{id}/status")
    public Application updateStatus(@PathVariable Long id, @RequestParam String status) {
        Application app = applicationRepository.findById(id).orElseThrow();
        app.setStatus(status);
        Application updatedApp = applicationRepository.save(app);

        // Notify Student
        if (app.getStudent() != null && app.getStudent().getEmail() != null) {
            String subject = "Update on your application for " + app.getInternship().getTitle();
            String message = "Hi " + app.getStudent().getName() + ",\n\nYour application status for " + 
                             app.getInternship().getTitle() + " has been updated to: " + status + 
                             ".\n\nBest regards,\nKaroStartup Team";
            emailService.sendEmail(app.getStudent().getEmail(), subject, message);
        }

        return updatedApp;
    }

    @GetMapping("/internship/{id}")
    public List<Application> getByInternship(@PathVariable Long id) {
        return applicationRepository.findByInternshipId(id);
    }

    @GetMapping
    public List<Application> getAllApplications() {
        return applicationRepository.findAll();
    }

    @GetMapping("/company/{companyId}")
    public List<Application> getByCompany(@PathVariable Long companyId) {
        return applicationRepository.findByInternshipCompanyId(companyId);
    }

    @GetMapping("/student/{email}")
    public List<Application> getByStudentEmail(@PathVariable String email) {
        return applicationRepository.findByStudentEmail(email);
    }

    @DeleteMapping("/{id}")
    public void deleteApplication(@PathVariable Long id) {
        applicationRepository.deleteById(id);
    }
}
