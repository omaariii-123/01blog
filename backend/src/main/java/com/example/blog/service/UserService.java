package com.example.blog.service;

import com.example.blog.model.User;
import com.example.blog.repository.UserRepository;
import lombok.RequiredArgsConstructor;

import java.util.stream.Collectors;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

   
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
}
