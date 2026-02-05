package com.example.blog.controller;

import com.example.blog.dto.ReportResponse;
import com.example.blog.model.Report;
import com.example.blog.model.User;
import com.example.blog.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    // Reporting endpoint is available to all users, but managed by admins
    @PostMapping("/report")
    public ResponseEntity<Void> createReport(
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) Long postId,
            @RequestParam String reason) {
        adminService.createReport(userId, postId, reason);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @GetMapping("/reports")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ReportResponse>> getAllReports() {
        return ResponseEntity.ok(adminService.getAllReports());
    }

    @PutMapping("/users/{id}/ban")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> banUser(@PathVariable Long id) {
        adminService.banUser(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/posts/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        adminService.deletePost(id);
        return ResponseEntity.ok().build();
    }
    @PutMapping("/posts/hide/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> hidePost(@PathVariable Long id) {
        adminService.hidePost(id);
        return ResponseEntity.ok().build();
    }
    @PutMapping("/posts/unhide/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> unHidePost(@PathVariable Long id) {
        adminService.unHidePost(id);
        return ResponseEntity.ok().build();
    }
}
