package myapp.controller;

import org.springframework.web.bind.annotation.*;
import myapp.model.Post;
import myapp.service.PostService;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.util.List; 

@RestController
@RequestMapping("/api/posts")
public class PostController {
	private final PostService postService;
	public PostController(PostService postService) {
		this.postService = postService;
	}
	@PostMapping("/create")
	public Long createPost(@RequestBody Post post) {
		return this.postService.savePost(post);	
	}
	@PostMapping("/get")
	public ResponseEntity<List<Post>>getPosts(long userId) {
		return ResponseEntity.status(HttpStatus.OK).body(this.postService.getPosts(userId));
	} 
}
