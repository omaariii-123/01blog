package com.example.blog.controller;

import com.example.blog.dto.CommentRequest;
import com.example.blog.dto.CommentResponse;
import com.example.blog.service.InteractionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/interactions")
@RequiredArgsConstructor
public class InteractionController {

    private final InteractionService service;

    @PostMapping("/comments/{postId}")
    public ResponseEntity<CommentResponse> addComment(
            @PathVariable Long postId,
            @RequestBody CommentRequest request) {
        return ResponseEntity.ok(service.addComment(postId, request));
    }

    @GetMapping("/comments/{postId}")
    public ResponseEntity<List<CommentResponse>> getComments(@PathVariable Long postId) {
        return ResponseEntity.ok(service.getComments(postId));
    }

    @PostMapping("/likes/{postId}")
    public ResponseEntity<Void> toggleLike(@PathVariable Long postId) {
        service.toggleLike(postId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/likes/{postId}/count")
    public ResponseEntity<Long> getLikeCount(@PathVariable Long postId) {
        return ResponseEntity.ok(service.getLikeCount(postId));
    }
}
