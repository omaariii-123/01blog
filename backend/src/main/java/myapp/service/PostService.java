package myapp.service;

import myapp.model.Post;
import myapp.repository.PostRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class PostService {
	private final PostRepository postRepository;
	public PostService(PostRepository postRepository) {
		this.postRepository = postRepository;
	}
	public long savePost(Post post){
		return this.postRepository.save(post).getId();
	}
	public List<Post> getPosts(long userId) {
		return this.postRepository.findByUserId(userId);
	}
}
