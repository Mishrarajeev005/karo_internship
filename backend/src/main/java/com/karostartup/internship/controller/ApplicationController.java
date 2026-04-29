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
        return applicationRepository.save(app);
    }

    @GetMapping("/internship/{id}")
    public List<Application> getByInternship(@PathVariable Long id) {
        return applicationRepository.findByInternshipId(id);
    }

    @GetMapping
    public List<Application> getAllApplications() {
        return applicationRepository.findAll();
    }

    @DeleteMapping("/{id}")
    public void deleteApplication(@PathVariable Long id) {
        applicationRepository.deleteById(id);
    }
}
