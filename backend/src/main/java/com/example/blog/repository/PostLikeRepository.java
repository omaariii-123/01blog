package com.example.blog.repository;

import com.example.blog.model.Post;
import com.example.blog.model.PostLike;
import com.example.blog.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PostLikeRepository extends JpaRepository<PostLike, Long> {
    Optional<PostLike> findByPostAndUser(Post post, User user);

    long countByPost(Post post);

    void deleteByPost(Post post);
}
