package com.example.blog.service;

import com.example.blog.model.Notification;
import com.example.blog.model.User;
import com.example.blog.repository.NotificationRepository;
import com.example.blog.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.stream.Collector;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.blog.dto.UserDto;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;

    public User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Transactional
    public void followUser(Long targetUserId) {
        User currentUser = getCurrentUser();
        User targetUser = userRepository.findById(targetUserId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (currentUser.getId().equals(targetUser.getId())) {
            throw new RuntimeException("Cannot follow yourself");
        }

        currentUser.getFollowing().add(targetUser);
        userRepository.save(currentUser);

        // Notify target user about the new follower
        Notification notif = Notification.builder()
                .user(targetUser)
                .message(currentUser.getUsername() + " subscribed to your block!")
                .read(false)
                .build();
        notificationRepository.save(notif);
    }

    @Transactional
    public void unfollowUser(Long targetUserId) {
        User currentUser = getCurrentUser();
        User targetUser = userRepository.findById(targetUserId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        currentUser.getFollowing().remove(targetUser);
        userRepository.save(currentUser);
    }

    public boolean isFollowing(Long targetUserId) {
        User currentUser = getCurrentUser();
        return currentUser.getFollowing().stream()
                .anyMatch(u -> u.getId().equals(targetUserId));
    }

    @Transactional(readOnly = true)
    public long getFollowersCount(String username) {
        User user = getUserByUsername(username);
        return user.getFollowers().size();
    }

    @Transactional(readOnly = true)
    public long getFollowingCount(String username) {
        User user = getUserByUsername(username);
        return user.getFollowing().size();
    }

    public Page<UserDto> getSuggestedUsers(Pageable pageable) {
        User user = getCurrentUser();
        List<Long> excluded = user.getFollowing().stream().map(u -> u.getId()).collect(Collectors.toList());
        excluded.add(user.getId());
        return userRepository.findByIdNotIn(excluded, pageable)
                .map(u -> new UserDto(u.getUsername(), u.getId(), u.getRole().toString()));
    }
}