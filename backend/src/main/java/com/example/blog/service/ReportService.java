package com.example.blog.service;

import com.example.blog.dto.ReportResponse;
import com.example.blog.exception.UserNotFoundException;
import com.example.blog.model.Report;
import com.example.blog.repository.ReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final ReportRepository reportRepository;

    public ReportResponse getReportDto(Long id) {
        // Fetchin the Entity using an optimized JOIN FETCH query
        Report report = reportRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new UserNotFoundException("Report not found"));

        return ReportResponse.builder()
                .id(report.getId())
                .reason(report.getReason())
                .createdAt(report.getCreatedAt())

                .reporterId(report.getReporter().getId())
                .reporterUsername(report.getReporter().getUsername())

                .reportedUserId(report.getReportedUser().getId())
                .reportedUsername(report.getReportedUser().getUsername())

                // Handle the optional post safely
                .reportedPostId(report.getReportedPost() != null ? report.getReportedPost().getId() : null)
                .reportedPostContent(
                        report.getReportedPost() != null ? report.getReportedPost().getDescription() : null)
                .build();
    }
}