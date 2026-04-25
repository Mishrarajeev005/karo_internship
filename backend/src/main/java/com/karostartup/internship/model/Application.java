package com.karostartup.internship.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Application {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Student student;

    @ManyToOne
    private Internship internship;

    private String status; // APPLIED, REVIEWING, SELECTED, REJECTED
}
