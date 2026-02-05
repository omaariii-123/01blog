package com.example.blog.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.Formula;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "posts")
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Formula("(SELECT COUNT(*) FROM likes AS pl WHERE pl.post_id = id)")
    private Long likeCount;

    public Long getLikeCount() {
        return likeCount;
    }
    @Formula("(SELECT COUNT(*) FROM comments AS c WHERE c.post_id = id)")
    private Long commentCount;

    public Long getCommentCount() {
        return commentCount;
    }
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User author;

    @Column(length = 2000)
    private String description;

    private String mediaUrl;
    private String mediaType; // IMAGE or VIDEO
    
    @Builder.Default
    private Boolean hidden = false;

    @CreationTimestamp
    private LocalDateTime createdAt;
@   OneToMany(mappedBy = "reportedPost", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Report> reports = new ArrayList<>();
    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private java.util.List<Comment> comments = new java.util.ArrayList<>();
}
