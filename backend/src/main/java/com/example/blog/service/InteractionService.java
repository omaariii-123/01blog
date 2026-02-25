package com.example.blog.service;

import com.example.blog.dto.CommentRequest;
import com.example.blog.dto.CommentResponse;
import com.example.blog.model.Comment;
import com.example.blog.model.Notification;
import com.example.blog.model.Post;
import com.example.blog.model.PostLike;
import com.example.blog.model.User;
import com.example.blog.repository.CommentRepository;
import com.example.blog.repository.NotificationRepository;
import com.example.blog.repository.PostLikeRepository;
import com.example.blog.repository.PostRepository;
import com.example.blog.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InteractionService {

    private final CommentRepository commentRepository;
    private final PostLikeRepository postLikeRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;

    private User getCurrentUser() {
        String username = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal())
                .getUsername();
        return userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Transactional
    public CommentResponse addComment(Long postId, CommentRequest request) {
        User user = getCurrentUser();
        Post post = postRepository.findById(postId).orElseThrow(() -> new RuntimeException("Post not found"));

        Comment comment = Comment.builder()
                .author(user)
                .post(post)
                .content(request.getContent())
                .build();

        comment = commentRepository.save(comment);

        // Notify post author if someone else commented
        if (!post.getAuthor().getId().equals(user.getId())) {
            Notification notif = Notification.builder()
                    .user(post.getAuthor())
                    .message(user.getUsername() + " commented on your post.")
                    .read(false)
                    .build();
            notificationRepository.save(notif);
        }

        return CommentResponse.builder()
                .id(comment.getId())
                .postId(post.getId())
                .author(user.getUsername())
                .content(comment.getContent())
                .createdAt(comment.getCreatedAt())
                .build();
    }

    public List<CommentResponse> getComments(Long postId) {
        Post post = postRepository.findById(postId).orElseThrow(() -> new RuntimeException("Post not found"));
        return commentRepository.findByPostOrderByCreatedAtAsc(post).stream()
                .map(comment -> CommentResponse.builder()
                        .id(comment.getId())
                        .postId(post.getId())
                        .author(comment.getAuthor().getUsername())
                        .content(comment.getContent())
                        .createdAt(comment.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional
    public void toggleLike(Long postId) {
        User user = getCurrentUser();
        Post post = postRepository.findById(postId).orElseThrow(() -> new RuntimeException("Post not found"));

        Optional<PostLike> existingLike = postLikeRepository.findByPostAndUser(post, user);
        if (existingLike.isPresent()) {
            postLikeRepository.delete(existingLike.get());
        } else {
            PostLike like = PostLike.builder()
                    .post(post)
                    .user(user)
                    .build();
            postLikeRepository.save(like);

            // Notify post author if someone else liked it
            if (!post.getAuthor().getId().equals(user.getId())) {
                Notification notif = Notification.builder()
                        .user(post.getAuthor())
                        .message(user.getUsername() + " liked your post.")
                        .read(false)
                        .build();
                notificationRepository.save(notif);
            }
        }
    }

    public long getLikeCount(Long postId) {
        Post post = postRepository.findById(postId).orElseThrow(() -> new RuntimeException("Post not found"));
        return postLikeRepository.countByPost(post);
    }
}