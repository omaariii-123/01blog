package com.example.blog.service;

import com.example.blog.dto.ReportResponse;
import com.example.blog.exception.UserNotFoundException;
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
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final ReportRepository reportRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public void banUser(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(UserNotFoundException::new);
        user.setBanned(!user.isBanned());
        userRepository.save(user);
    }

    public void deletePost(Long postId) {
        postRepository.deleteById(postId);
    }

    @Transactional
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId).orElseThrow();

        user.getFollowing().forEach(followedUser -> followedUser.getFollowers().remove(user));
        user.getFollowers().forEach(follower -> follower.getFollowing().remove(user));

        user.getFollowing().clear();
        user.getFollowers().clear();

        userRepository.save(user);
        userRepository.delete(user);
    }

    public void createReport(Long userId, Long postId, String reason) {
        String username = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal())
                .getUsername();
        User reporter = userRepository.findByUsername(username).orElseThrow(UserNotFoundException::new);

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

    public List<ReportResponse> getAllReports() {
        return reportRepository.findAll().stream()
                .map(this::mapToReportResponse)
                .collect(Collectors.toList());
    }

    private ReportResponse mapToReportResponse(Report report) {
        return ReportResponse.builder()
                .id(report.getId())
                .reason(report.getReason())
                .createdAt(report.getCreatedAt())

                // Safely extract Reporter info
                .reporterId(report.getReporter().getId())
                .reporterUsername(report.getReporter().getUsername())

                // Handle potential nulls (e.g., if reportedUser is null)
                .reportedUserId(report.getReportedUser() != null ? report.getReportedUser().getId() : null)
                .reportedUsername(report.getReportedUser() != null ? report.getReportedUser().getUsername() : null)

                .reportedPostId(report.getReportedPost() != null ? report.getReportedPost().getId() : null)
                .hidden(report.getReportedPost() != null && report.getReportedPost().getHidden() != null
                        ? report.getReportedPost().getHidden()
                        : null)
                .build();
    }

    public void hidePost(Long id) {
        Post post = postRepository.findById(id).orElseThrow(() -> new UsernameNotFoundException("Post not found"));
        post.setHidden(true);
        postRepository.save(post);
    }

    public void unHidePost(Long id) {
        Post post = postRepository.findById(id).orElseThrow(() -> new UsernameNotFoundException("Post not found"));
        post.setHidden(false);
        postRepository.save(post);
    }
}
