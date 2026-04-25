package com.karostartup.internship.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
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
}
