package com.example.blog.repository;

import com.example.blog.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserUsernameOrderByCreatedAtDesc(String username);
}