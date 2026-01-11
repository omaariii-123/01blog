package com.example.blog.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PostResponse {
    private Long id;
    private String author;
    private String description;
    private String mediaUrl;
    private String mediaType;
    private LocalDateTime createdAt;
    private Long likeCount;
    private Long commentCount;
}
