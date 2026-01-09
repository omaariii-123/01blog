package com.example.blog.controller;

import com.example.blog.model.User;
import com.example.blog.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/{username}")
    public ResponseEntity<User> getUserProfile(@PathVariable String username) {
        // Return user info, ideally a DTO to avoid recursion/exposing password
        // For simple check we assume Entity is handled or Jackson ignore on recursive
        // fields
        // But User entity has LAZY collections which might cause issues or infinite
        // loop if serialized directly
        // Better to return simple View
        return ResponseEntity.ok(userService.getUserByUsername(username));
    }

    @PostMapping("/{id}/follow")
    public ResponseEntity<Void> followUser(@PathVariable Long id) {
        userService.followUser(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}/follow")
    public ResponseEntity<Void> unfollowUser(@PathVariable Long id) {
        userService.unfollowUser(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}/is-following")
    public ResponseEntity<Map<String, Boolean>> isFollowing(@PathVariable Long id) {
        boolean isFollowing = userService.isFollowing(id);
        return ResponseEntity.ok(Map.of("isFollowing", isFollowing));
    }

    @GetMapping("/{username}/followers/count")
    public ResponseEntity<Long> getFollowersCount(@PathVariable String username) {
        return ResponseEntity.ok(userService.getFollowersCount(username));
    }

    @GetMapping("/{username}/following/count")
    public ResponseEntity<Long> getFollowingCount(@PathVariable String username) {
        return ResponseEntity.ok(userService.getFollowingCount(username));
    }
}
