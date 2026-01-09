import { Component, Input, Output, EventEmitter, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PostService, Post, Comment } from '../../post.service';
import { AdminService } from '../../admin.service';
import { ReportDialogComponent } from '../report-dialog/report-dialog.component';

@Component({
    selector: 'app-post-card',
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        RouterModule,
        FormsModule
    ],
    template: `
    <mat-card class="post-card">
      <mat-card-header>
        <div mat-card-avatar class="avatar-placeholder" [style.background-image]="'url(https://api.dicebear.com/9.x/initials/svg?seed=' + post.author + ')'"></div>
        <mat-card-title>
             <a [routerLink]="['/block', post.author]" class="author-link">{{ post.author }}</a>
        </mat-card-title>
        <mat-card-subtitle>
            {{ post.createdAt | date:'mediumDate' }} • <span class="tag">#ExampleTopic</span>
        </mat-card-subtitle>
        <span class="spacer"></span>
        <button mat-icon-button [matMenuTriggerFor]="menu">
            <mat-icon>more_vert</mat-icon>
        </button>
        <mat-menu #menu="matMenu">
            <button mat-menu-item (click)="onReport()">
                <mat-icon>flag</mat-icon>
                <span>Report Post</span>
            </button>
        </mat-menu>
      </mat-card-header>

      <mat-card-content>
        <p class="post-text">{{ post.description }}</p>
        @if (post.mediaUrl) {
            <div class="media-container">
                <img [src]="'/uploads/' + post.mediaUrl" alt="Post media">
            </div>
        }
      </mat-card-content>

      <mat-card-actions align="start">
        <button mat-button class="action-btn" [class.liked]="post.likedByCurrentUser" (click)="toggleLike()">
          <mat-icon>{{ post.likedByCurrentUser ? 'favorite' : 'favorite_border' }}</mat-icon>
          <span class="count">{{ post.likeCount || 0 }}</span>
        </button>
        
        <button mat-button class="action-btn" (click)="toggleComments()">
          <mat-icon>chat_bubble_outline</mat-icon>
          <span class="count">{{ post.comments?.length || 0 }}</span>
        </button>
      </mat-card-actions>

      @if (showComments()) {
        <div class="comments-section">
            <div class="comment-input-area">
                <input type="text" [(ngModel)]="newComment" placeholder="Write a comment..." (keyup.enter)="addComment()">
                <button mat-icon-button color="primary" (click)="addComment()" [disabled]="!newComment">
                    <mat-icon>send</mat-icon>
                </button>
            </div>
            
            <div class="comments-list">
                @for (comment of post.comments; track comment.id) {
                    <div class="comment-item">
                        <span class="comment-author">{{ comment.author }}</span>
                        <span class="comment-content">{{ comment.content }}</span>
                    </div>
                }
            </div>
        </div>
      }
    </mat-card>
  `,
    styles: [`
    .post-card {
        margin-bottom: 24px;
        border-radius: 12px;
        border: none;
        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        background: white;
    }

    .avatar-placeholder {
        background-size: cover;
        background-position: center;
        border: 1px solid rgba(0,0,0,0.1);
    }

    .author-link {
        color: var(--text-primary);
        text-decoration: none;
        font-weight: 600;
    }

    .author-link:hover {
        text-decoration: underline;
    }

    .spacer {
        flex: 1;
    }

    .post-text {
        font-size: 1rem;
        color: var(--text-primary);
        line-height: 1.5;
        margin: 16px 0;
        white-space: pre-wrap;
    }

    .media-container {
        width: 100%;
        max-height: 400px;
        overflow: hidden;
        border-radius: 8px;
        border: 1px solid rgba(0,0,0,0.05);
        display: flex;
        justify-content: center;
        background: #f0f0f0;
    }

    .media-container img {
        max-width: 100%;
        max-height: 400px;
        object-fit: contain;
    }

    .action-btn {
        color: var(--text-secondary);
        min-width: unset;
        padding: 0 16px;
    }

    .action-btn mat-icon {
        margin-right: 8px;
    }

    .action-btn.liked {
        color: var(--warn-color);
    }

    .comments-section {
        padding: 0 16px 16px;
        border-top: 1px solid var(--divider-color);
        background: #fafafa;
    }

    .comment-input-area {
        display: flex;
        align-items: center;
        padding: 12px 0;
        gap: 8px;
    }

    .comment-input-area input {
        flex: 1;
        padding: 8px 12px;
        border-radius: 20px;
        border: 1px solid var(--divider-color);
        outline: none;
    }

    .comment-input-area input:focus {
        border-color: var(--primary-color);
    }

    .comment-item {
        padding: 8px 0;
        font-size: 0.9rem;
        border-bottom: 1px solid rgba(0,0,0,0.03);
    }

    .comment-author {
        font-weight: 600;
        margin-right: 8px;
        color: var(--primary-dark);
    }

    .post-card mat-card-content {
        padding-bottom: 8px; 
    }
  `]
})
export class PostCardComponent {
    @Input({ required: true }) post!: Post;
    @Output() postUpdated = new EventEmitter<Post>();

    showComments = signal(false);
    newComment = '';

    private postService = inject(PostService);
    private adminService = inject(AdminService);
    private dialog = inject(MatDialog);

    toggleLike() {
        this.post.likedByCurrentUser = !this.post.likedByCurrentUser;
        this.post.likeCount += this.post.likedByCurrentUser ? 1 : -1;

        this.postService.likePost(this.post.id).subscribe({
            error: () => {
                // Revert
                this.post.likedByCurrentUser = !this.post.likedByCurrentUser;
                this.post.likeCount += this.post.likedByCurrentUser ? 1 : -1;
            }
        });
    }

    toggleComments() {
        this.showComments.set(!this.showComments());
        if (this.showComments() && (!this.post.comments || this.post.comments.length === 0)) {
            this.postService.getComments(this.post.id).subscribe(comments => {
                this.post.comments = comments;
            });
        }
    }

    addComment() {
        if (!this.newComment.trim()) return;

        this.postService.addComment(this.post.id, this.newComment).subscribe(comment => {
            if (!this.post.comments) this.post.comments = [];
            this.post.comments.push(comment);
            this.newComment = '';
        });
    }

    onReport() {
        const dialogRef = this.dialog.open(ReportDialogComponent, {
            width: '400px',
            data: { type: 'Post', id: this.post.id }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.adminService.createReport(null, this.post.id, result).subscribe({
                    next: () => alert('Report submitted successfully'),
                    error: () => alert('Failed to submit report')
                });
            }
        });
    }
}
