package com.example.blog.repository;

import com.example.blog.model.Post;
import com.example.blog.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findByHiddenFalseOrderByCreatedAtDesc();

    List<Post> findAllByOrderByCreatedAtDesc();

    List<Post> findAllByAuthorAndHiddenFalseOrderByCreatedAtDesc(User author);

    List<Post> findByAuthorInAndHiddenFalseOrderByCreatedAtDesc(Collection<User> authors);
}