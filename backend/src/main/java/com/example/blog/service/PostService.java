package com.example.blog.service;

import com.example.blog.dto.PostRequest;
import com.example.blog.dto.PostResponse;
import com.example.blog.model.Notification;
import com.example.blog.model.Post;
import com.example.blog.model.User;
import com.example.blog.repository.NotificationRepository;
import com.example.blog.repository.PostRepository;
import com.example.blog.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final FileStorageService fileStorageService;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;

    @Transactional
    public PostResponse createPost(PostRequest request) throws IOException {
        String username = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal())
                .getUsername();
        User user = userRepository.findByUsername(username).orElseThrow();

        String mediaUrl = null;
        String mediaType = null;

        if (request.getFile() != null && !request.getFile().isEmpty()) {
            mediaUrl = fileStorageService.saveFile(request.getFile());
            mediaType = request.getFile().getContentType().startsWith("image") ? "IMAGE" : "VIDEO";
        }

        Post post = Post.builder()
                .author(user)
                .description(request.getDescription())
                .mediaUrl(mediaUrl)
                .mediaType(mediaType)
                .build();
        post = postRepository.save(post);

        // ONLY Notify followers when you post
        try {
            for (User follower : user.getFollowers()) {
                Notification notif = Notification.builder()
                        .user(follower)
                        .message(user.getUsername() + " published a new post!")
                        .read(false)
                        .build();
                notificationRepository.save(notif);
            }
        } catch (Exception e) {
            System.out.println("Could not load followers: " + e.getMessage());
        }

        return mapToResponse(post);
    }

    @Transactional
    public PostResponse updatePost(Long postId, String description) {
        String username = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal())
                .getUsername();
        Post post = postRepository.findById(postId).orElseThrow(() -> new RuntimeException("Post not found"));

        if (!post.getAuthor().getUsername().equals(username)) {
            throw new RuntimeException("Not authorized");
        }

        post.setDescription(description);
        return mapToResponse(postRepository.save(post));
    }

    public List<PostResponse> getAllPosts(boolean isAdmin) {
       List<Post> posts;
    
       if (isAdmin) {
           posts = postRepository.findAllByOrderByCreatedAtDesc();
       } else {
           posts = postRepository.findByHiddenFalseOrderByCreatedAtDesc();
       }
    
       return posts.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PostResponse> getFeed() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        java.util.Set<User> feedAuthors = new java.util.HashSet<>(user.getFollowing());
        feedAuthors.add(user);

        if (feedAuthors.size() == 1) {
            return postRepository.findByHiddenFalseOrderByCreatedAtDesc().stream()
                    .map(this::mapToResponse)
                    .collect(Collectors.toList());
        }

        return postRepository.findByAuthorInAndHiddenFalseOrderByCreatedAtDesc(feedAuthors).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<PostResponse> getUserPosts(String username) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        return postRepository.findAllByAuthorOrderByCreatedAtDesc(user).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public void deletePost(Long postId) {
        String username = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal())
                .getUsername();
        Post post = postRepository.findById(postId).orElseThrow(() -> new RuntimeException("Post not found"));

        if (!post.getAuthor().getUsername().equals(username)) {
            throw new RuntimeException("Not authorized");
        }

        postRepository.delete(post);
    }

    private PostResponse mapToResponse(Post post) {
        return PostResponse.builder()
                .id(post.getId())
                .author(post.getAuthor().getUsername())
                .description(post.getDescription())
                .mediaUrl(post.getMediaUrl())
                .mediaType(post.getMediaType())
                .createdAt(post.getCreatedAt())
                .likeCount(post.getLikeCount())
                .commentCount(post.getCommentCount())
                .build();
    }
}