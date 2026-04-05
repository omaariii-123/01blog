package com.example.blog.controller;

import com.example.blog.dto.UserDto;
import com.example.blog.model.User;
import com.example.blog.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/{username}")
    public ResponseEntity<UserDto> getUserProfile(@PathVariable String username) {
        User usr = userService.getUserByUsername(username);
        return ResponseEntity.ok(new UserDto(usr.getUsername(), usr.getId(), usr.getRole().name()));
    }

    @PostMapping("/{id}/follow")
    public ResponseEntity<Void> followUser(@PathVariable Long id) {
        userService.followUser(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}/unfollow")
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

    @GetMapping("/suggested")
    public Page<UserDto> getSuggestedUsers(Pageable pageable) {
        return userService.getSuggestedUsers(pageable);
    }
}
