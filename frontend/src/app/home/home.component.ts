import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostService, Post } from '../post.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';
import { PostCardComponent } from '../shared/post-card/post-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    FormsModule,
    PostCardComponent
  ],
  template: `
    <div class="feed-layout">
        <!-- Left Sidebar: Navigation -->
        <aside class="sidebar left-sidebar">
            <mat-card class="nav-card">
                <mat-card-content>
                    <div class="user-mini-profile" *ngIf="authService.currentUser()">
                        <div class="avatar-large" [style.background-image]="'url(https://api.dicebear.com/9.x/initials/svg?seed=' + authService.currentUser() + ')'"></div>
                        <h3>{{ authService.currentUser() }}</h3>
                        <p class="subtitle">Student Developer</p>
                    </div>
                
                    <nav class="side-nav">
                        <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-item">
                            <mat-icon>home</mat-icon> Home
                        </a>
                        <a [routerLink]="['/block', authService.currentUser()]" routerLinkActive="active" class="nav-item">
                            <mat-icon>person</mat-icon> My Block
                        </a>
                        <a href="#" class="nav-item">
                            <mat-icon>bookmarks</mat-icon> Saved Posts
                        </a>
                         <a href="#" class="nav-item">
                            <mat-icon>settings</mat-icon> Settings
                        </a>
                    </nav>
                </mat-card-content>
            </mat-card>
        </aside>

        <!-- Center Column: Feed -->
        <main class="feed-column">
            @if (authService.isLoggedIn()) {
                <mat-card class="create-post-card">
                    <div class="create-post-row">
                        <div class="avatar-small" [style.background-image]="'url(https://api.dicebear.com/9.x/initials/svg?seed=' + authService.currentUser() + ')'"></div>
                        <input type="text" [(ngModel)]="newPostContent" placeholder="What are you learning today?" (keyup.enter)="createPost()">
                    </div>
                    <div class="create-post-actions" *ngIf="newPostContent">
                        <button mat-button color="primary">
                            <mat-icon>image</mat-icon> Media
                        </button>
                         <span class="spacer"></span>
                        <button mat-flat-button color="primary" (click)="createPost()" [disabled]="!newPostContent">Post</button>
                    </div>
                </mat-card>
            }

            <div class="posts-list">
                @for (post of posts; track post.id) {
                    <app-post-card [post]="post"></app-post-card>
                } @empty {
                     <div class="empty-state">
                        <mat-icon>post_add</mat-icon>
                        <h3>No posts yet</h3>
                        <p>Follow other students or create your first post!</p>
                    </div>
                }
            </div>
        </main>

        <!-- Right Sidebar: Discovery -->
        <aside class="sidebar right-sidebar">
            <mat-card class="discovery-card">
                <mat-card-header>
                    <mat-card-title>Suggested Blocks</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                    <div class="suggestion-list">
                        <!-- Mock data for now -->
                        <div class="suggestion-item">
                            <div class="avatar-mini" style="background-image: url(https://api.dicebear.com/9.x/initials/svg?seed=Alice)"></div>
                            <div class="info">
                                <span class="name">Alice Dev</span>
                                <span class="handle">@alice</span>
                            </div>
                            <button mat-icon-button color="primary"><mat-icon>person_add</mat-icon></button>
                        </div>
                         <div class="suggestion-item">
                            <div class="avatar-mini" style="background-image: url(https://api.dicebear.com/9.x/initials/svg?seed=Bob)"></div>
                            <div class="info">
                                <span class="name">Bob Coder</span>
                                <span class="handle">@bob</span>
                            </div>
                            <button mat-icon-button color="primary"><mat-icon>person_add</mat-icon></button>
                        </div>
                    </div>
                </mat-card-content>
            </mat-card>

            <mat-card class="trending-card">
                 <mat-card-header>
                    <mat-card-title>Trending Topics</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                    <div class="topic-list">
                        <span class="topic-tag">#Angular</span>
                        <span class="topic-tag">#SpringSecurity</span>
                        <span class="topic-tag">#WebDev</span>
                        <span class="topic-tag">#Java21</span>
                    </div>
                </mat-card-content>
            </mat-card>
        </aside>
    </div>
  `,
  styles: [`
    .nav-card {
        padding: 0;
    }
    
    .user-mini-profile {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 24px 16px;
        border-bottom: 1px solid var(--divider-color);
        margin-bottom: 8px;
    }

    .avatar-large {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background-color: #eee;
        background-size: cover;
        margin-bottom: 12px;
        border: 3px solid white;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }

    .user-mini-profile h3 {
        margin: 0;
        font-size: 1.2rem;
        font-weight: 600;
    }

    .subtitle {
        margin: 4px 0 0;
        color: var(--text-secondary);
        font-size: 0.9rem;
    }

    .side-nav {
        display: flex;
        flex-direction: column;
        padding: 8px;
    }

    .nav-item {
        display: flex;
        align-items: center;
        padding: 12px 16px;
        color: var(--text-secondary);
        text-decoration: none;
        border-radius: 8px;
        transition: all 0.2s;
        font-weight: 500;
    }

    .nav-item mat-icon {
        margin-right: 12px;
    }

    .nav-item:hover {
        background-color: rgba(0,0,0,0.04);
        color: var(--primary-color);
    }

    .nav-item.active {
        background-color: rgba(63, 81, 181, 0.08); /* Primary color low opacity */
        color: var(--primary-color);
    }

    .create-post-card {
        margin-bottom: 24px;
        padding: 16px !important;
    }

    .create-post-row {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .avatar-small {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: #eee;
        background-size: cover;
        flex-shrink: 0;
    }

    .create-post-row input {
        flex: 1;
        border: none;
        background: #f1f2f6;
        padding: 12px 16px;
        border-radius: 24px;
        outline: none;
        font-size: 1rem;
        transition: background 0.2s;
    }

    .create-post-row input:focus {
        background: #e8eaf0;
    }

    .create-post-actions {
        display: flex;
        align-items: center;
        margin-top: 12px;
        padding-top: 12px;
        border-top: 1px solid var(--divider-color);
    }

    .spacer {
        flex: 1;
    }

    .right-sidebar {
        display: flex;
        flex-direction: column;
        gap: 24px;
    }

    .suggestion-item {
        display: flex;
        align-items: center;
        padding: 8px 0;
        border-bottom: 1px solid var(--divider-color);
    }
    
    .suggestion-item:last-child {
        border-bottom: none;
    }

    .avatar-mini {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background-color: #eee;
        background-size: cover;
        margin-right: 12px;
    }

    .info {
        display: flex;
        flex-direction: column;
        flex: 1;
    }

    .info .name {
        font-weight: 600;
        font-size: 0.9rem;
    }

    .info .handle {
        font-size: 0.8rem;
        color: var(--text-secondary);
    }

    .topic-list {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
    }

    .topic-tag {
        background: #e3f2fd;
        color: var(--primary-color);
        padding: 4px 12px;
        border-radius: 16px;
        font-size: 0.85rem;
        cursor: pointer;
    }

    .topic-tag:hover {
        background: #bbdefb;
    }

    .empty-state {
        text-align: center;
        padding: 40px;
        color: var(--text-secondary);
    }
    
    .empty-state mat-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        margin-bottom: 16px;
        opacity: 0.5;
    }
  `]
})
export class HomeComponent implements OnInit {
  posts: Post[] = [];
  newPostContent = '';

  authService = inject(AuthService);
  private postService = inject(PostService);

  ngOnInit() {
    this.loadPosts();
  }

  loadPosts() {
    this.postService.getAllPosts().subscribe(posts => {
      // Map and init basic state
      this.posts = posts.map(p => ({
        ...p,
        likeCount: p.likeCount || 0,
        likedByCurrentUser: false,
        comments: []
      }));

      // Enrich posts (likes, comments)
      this.posts.forEach(post => {
        this.postService.getLikeCount(post.id).subscribe(count => post.likeCount = count);
      });
    });
  }

  createPost() {
    if (!this.newPostContent.trim()) return;

    this.postService.createPost(this.newPostContent).subscribe({
      next: (post) => {
        const newPost: Post = { ...post, likeCount: 0, likedByCurrentUser: false, comments: [] };
        this.posts.unshift(newPost);
        this.newPostContent = '';
      },
      error: (err) => {
        console.error('Error creating post', err);
      }
    });
  }
}

