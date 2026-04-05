package com.example.blog.service;

import com.example.blog.dto.CommentRequest;
import com.example.blog.dto.CommentResponse;
import com.example.blog.exception.ForbiddenActionException;
import com.example.blog.exception.UserNotFoundException;
import com.example.blog.model.Comment;
import com.example.blog.model.Notification;
import com.example.blog.model.Post;
import com.example.blog.model.PostLike;
import com.example.blog.model.User;
import com.example.blog.repository.CommentRepository;
import com.example.blog.repository.NotificationRepository;
import com.example.blog.repository.PostLikeRepository;
import com.example.blog.repository.PostRepository;
import lombok.RequiredArgsConstructor;

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
    private final NotificationRepository notificationRepository;

    // Inject UserService instead of UserRepository
    private final UserService userService;

    private Post getPost(long postId) {
        return postRepository.findById(postId)
                .orElseThrow(() -> new UserNotFoundException("Post not found !"));
    }

    @Transactional
    public CommentResponse addComment(Long postId, CommentRequest request) {
        User user = userService.getCurrentUser();
        Post post = getPost(postId);

        Comment comment = Comment.builder()
                .author(user)
                .post(post)
                .content(request.getContent())
                .build();

        comment = commentRepository.save(comment);

        if (!post.getAuthor().getId().equals(user.getId())) {
            Notification notif = Notification.builder()
                    .user(post.getAuthor())
                    .message(user.getUsername() + " commented on your post.")
                    .read(false)
                    .build();
            notificationRepository.save(notif);
        }

        return mapToCommentResponse(comment, post.getId());
    }

    public List<CommentResponse> getComments(Long postId) {
        Post post = getPost(postId);
        return commentRepository.findByPostOrderByCreatedAtAsc(post).stream()
                .map(comment -> mapToCommentResponse(comment, post.getId()))
                .collect(Collectors.toList());
    }

    @Transactional
    public void toggleLike(Long postId) {
        User user = userService.getCurrentUser();
        Post post = getPost(postId);

        Optional<PostLike> existingLike = postLikeRepository.findByPostAndUser(post, user);

        if (existingLike.isPresent()) {
            postLikeRepository.delete(existingLike.get());
        } else {
            PostLike like = PostLike.builder()
                    .post(post)
                    .user(user)
                    .build();
            postLikeRepository.save(like);

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
        Post post = getPost(postId);
        return postLikeRepository.countByPost(post);
    }

    private CommentResponse mapToCommentResponse(Comment comment, Long postId) {
        return CommentResponse.builder()
                .id(comment.getId())
                .postId(postId)
                .author(comment.getAuthor().getUsername())
                .content(comment.getContent())
                .createdAt(comment.getCreatedAt())
                .build();
    }

    public void deleteComment(Long id) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("Comment not found"));
        String currentUsername = userService.getCurrentUser().getUsername();
        boolean isAdmin = userService.getCurrentUser().getRole().name().equals("ADMIN");

        // Check if the user owns the comment OR is an admin
        if (comment.getAuthor().getUsername().equals(currentUsername) || isAdmin) {
            commentRepository.delete(comment);
        } else {
            throw new ForbiddenActionException("You cannot delete this comment");
        }
    }
}