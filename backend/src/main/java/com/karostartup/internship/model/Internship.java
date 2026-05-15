package com.karostartup.internship.model;

import jakarta.persistence.*;

@Entity
public class Internship {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String companyName;
    private String location;
    private String stipend;
    
    @Column(length = 2000)
    private String description;

    @ManyToOne
    @JoinColumn(name = "company_id")
    private Company company;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getStipend() { return stipend; }
    public void setStipend(String stipend) { this.stipend = stipend; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Company getCompany() { return company; }
    public void setCompany(Company company) { this.company = company; }
}
