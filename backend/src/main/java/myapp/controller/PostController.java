package myapp.controller;

import org.springframework.web.bind.annotation.*;
import myapp.service.PostService;
import myapp.dto.PostRequestDto;
import myapp.dto.PostResponseDto;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import myapp.model.MyUserDetails;
import java.util.List;

@RestController
@RequestMapping("/api/posts")
public class PostController {
    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @PostMapping
    public ResponseEntity<Long> createPost(@RequestBody PostRequestDto postDto, @AuthenticationPrincipal MyUserDetails userDetails) {
        // Set userId from logged in user
        postDto.setUserId(userDetails.getId()); // Assuming MyUserDetails has getId()
        return ResponseEntity.status(HttpStatus.CREATED).body(this.postService.savePost(postDto));
    }

    @GetMapping
    public ResponseEntity<List<PostResponseDto>> getPosts(@AuthenticationPrincipal MyUserDetails userDetails) {
        return ResponseEntity.status(HttpStatus.OK).body(this.postService.getPosts(userDetails.getId()));
    }
}
