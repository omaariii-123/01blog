package myapp.repository;

import  org.springframework.stereotype.Repository;
import  org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import myapp.model.Post;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
	Post findById(long id);
	List<Post> findByUserId(long id);
}

