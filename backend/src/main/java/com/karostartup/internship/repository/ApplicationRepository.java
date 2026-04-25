package com.karostartup.internship.repository;

import com.karostartup.internship.model.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByInternshipId(Long internshipId);
    List<Application> findByStudentId(Long studentId);
}
