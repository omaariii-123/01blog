package com.example.blog.repository;

import com.example.blog.model.Comment;
import com.example.blog.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByPostOrderByCreatedAtAsc(Post post);

    void deleteByPost(Post post);
}
