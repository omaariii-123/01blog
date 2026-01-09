package com.example.blog.service;

import com.example.blog.model.Post;
import com.example.blog.model.Report;
import com.example.blog.model.User;
import com.example.blog.repository.PostRepository;
import com.example.blog.repository.ReportRepository;
import com.example.blog.repository.UserRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final ReportRepository reportRepository;
    
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public List<Report> getAllReports() {
        return reportRepository.findAll();
    }

    public void banUser(Long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        user.setBanned(!user.isBanned());
        userRepository.save(user);
    }

    public void deletePost(Long postId) {
        postRepository.deleteById(postId);
    }

    public void createReport(Long userId, Long postId, String reason) {
        String username = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal())
                .getUsername();
        User reporter = userRepository.findByUsername(username).orElseThrow();

        Report.ReportBuilder reportBuilder = Report.builder()
                .reporter(reporter)
                .reason(reason);

        if (userId != null) {
            User reportedUser = userRepository.findById(userId).orElseThrow();
            reportBuilder.reportedUser(reportedUser);
        }

        if (postId != null) {
            Post reportedPost = postRepository.findById(postId).orElseThrow();
            reportBuilder.reportedPost(reportedPost);
        }

        reportRepository.save(reportBuilder.build());
    }
}
