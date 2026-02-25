package com.example.blog.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;
import com.example.blog.model.Report;

public interface ReportRepository extends JpaRepository<Report, Long> {

    // Fetch a single report with all its relational data ready to go
    @Query("SELECT r FROM Report r " +
           "JOIN FETCH r.reporter " +
           "JOIN FETCH r.reportedUser " +
           "LEFT JOIN FETCH r.reportedPost " + // We use LEFT JOIN just in case the report is on a User, and there is no Post
           "WHERE r.id = :id")
    Optional<Report> findByIdWithDetails(@Param("id") Long id);

    // Fetch a list of reports, completely optimized
    @Query("SELECT r FROM Report r " +
           "JOIN FETCH r.reporter " +
           "JOIN FETCH r.reportedUser " +
           "LEFT JOIN FETCH r.reportedPost")
    List<Report> findAllWithDetails();
}