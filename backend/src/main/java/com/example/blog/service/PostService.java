package com.example.blog.service;

import com.example.blog.dto.PostRequest;
import com.example.blog.dto.PostResponse;
import com.example.blog.model.Post;
import com.example.blog.model.User;
import com.example.blog.repository.PostRepository;
import com.example.blog.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final FileStorageService fileStorageService;
    private final UserRepository userRepository;

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
        return mapToResponse(post);
    }

    public List<PostResponse> getAllPosts() {
        return postRepository.findAllByOrderByCreatedAtDesc().stream()
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
        // Add check if user is author or admin
        String username = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal())
                .getUsername();
        User user = userRepository.findByUsername(username).orElseThrow();
        Post post = postRepository.findById(postId).orElseThrow(() -> new RuntimeException("Post not found"));

        if (!post.getAuthor().getUsername().equals(username) && !user.getRole().name().equals("ADMIN")) {
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
                .build();
    }
}
