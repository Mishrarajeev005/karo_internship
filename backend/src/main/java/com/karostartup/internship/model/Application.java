package com.karostartup.internship.model;

import jakarta.persistence.*;

@Entity
public class Application {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Student student;

    @ManyToOne
    private Internship internship;

    private String status; // APPLIED, REVIEWING, SELECTED, REJECTED

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }
    public Internship getInternship() { return internship; }
    public void setInternship(Internship internship) { this.internship = internship; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
