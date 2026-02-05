package com.example.blog.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class ReportResponse {
    private Long id;
    private String reason;
    private LocalDateTime createdAt;
    
    // Flatten the objects (Just send the ID and Name)
    private Long reporterId;
    private String reporterUsername;
    
    private Long reportedUserId;
    private String reportedUsername;
    
    private boolean hidden;
    private Long reportedPostId;
    private String reportedPostContent; // Optional preview
}