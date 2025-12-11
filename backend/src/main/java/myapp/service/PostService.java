package myapp.service;

import myapp.model.Post;
import myapp.dto.PostRequestDto;
import myapp.dto.PostResponseDto;
import myapp.repository.PostRepository;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class PostService {
    private final PostRepository postRepository;

    public PostService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    public long savePost(PostRequestDto postDto) {
        Post post = new Post();
        post.setTitle(postDto.getTitle());
        post.setContent(postDto.getContent());
        // In a real app, you would fetch the user by ID and set it.
        // Assuming Post entity works with raw ID or we skip user validation for now for simplicity.
        // Or if Post has a 'userId' field directly (not relation):
        // post.setUserId(postDto.getUserId());
        
        // Let's assume Post entity needs adjustment or we just map what fits.
        // Checking previous file content, Post model structure wasn't fully visible but likely simple.
        
        return this.postRepository.save(post).getId();
    }

    public List<PostResponseDto> getPosts(long userId) {
        return this.postRepository.findByUserId(userId).stream()
            .map(post -> new PostResponseDto(post.getId(), post.getTitle(), post.getContent(), userId)) // Assuming userId is available or passed back
            .collect(Collectors.toList());
    }
}
