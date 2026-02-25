package com.example.blog.service;

import com.example.blog.dto.ReportResponse;
import com.example.blog.model.Report; 
import com.example.blog.repository.ReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final ReportRepository reportRepository;

    public ReportResponse getReportDto(Long id) {
        // 1. Fetch the Entity using our optimized JOIN FETCH query
        Report report = reportRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new RuntimeException("Report not found"));

        // 2. Map it to your awesome DTO
        return ReportResponse.builder()
                .id(report.getId())
                .reason(report.getReason())
                .createdAt(report.getCreatedAt())
                
                // These are safe and instant now! No extra queries, no proxy crashes.
                .reporterId(report.getReporter().getId())
                .reporterUsername(report.getReporter().getUsername())
                
                .reportedUserId(report.getReportedUser().getId())
                .reportedUsername(report.getReportedUser().getUsername())
                
                // Handle the optional post safely
                .reportedPostId(report.getReportedPost() != null ? report.getReportedPost().getId() : null)
                .reportedPostContent(report.getReportedPost() != null ? report.getReportedPost().getContent() : null)
                .build();
    }
}