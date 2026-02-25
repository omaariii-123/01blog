import { Component, Input, Output, inject, signal, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { PostService, Post } from '../../post.service';
import { AdminService } from '../../admin.service';
import { ReportDialogComponent } from '../report-dialog/report-dialog.component';
import { CommentsComponent } from '../comments/comments'; 

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
        CommentsComponent 
    ],
    template: `
    <mat-card class="post-card">
      <mat-card-header>
        <div mat-card-avatar class="avatar-placeholder" [style.background-image]="'url(https://api.dicebear.com/9.x/initials/svg?seed=' + post.author + ')'"></div>
        <mat-card-title>
             <a [routerLink]="['/block', post.author]" class="author-link">{{ post.author }}</a>
        </mat-card-title>
        <mat-card-subtitle>
            {{ post.createdAt | date:'mediumDate' }}
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
            <button mat-menu-item (click)="onDelete()">
                <mat-icon>delete</mat-icon>
                <span>Delete Post</span>
            </button>
        </mat-menu>
      </mat-card-header>

      <mat-card-content>
        <p class="post-text">{{ post.description }}</p>
        @if (post.mediaType === "IMAGE") {
            <div class="media-container">
                <img [src]="'http://localhost:8080/uploads/' + post.mediaUrl" alt="Post media">
            </div>      
        }@else {
        <div class="media-container">
        <video 
            [src]="'http://localhost:8080/uploads/' + post.mediaUrl" 
            width="100%" 
            controls 
            autoplay 
            muted 
            loop 
            playsinline>
            Your browser does not support the video tag.
        </video>        </div>
        }
      </mat-card-content>

      <mat-card-actions align="start">
        <button mat-button class="action-btn" [class.liked]="post.likedByCurrentUser" (click)="toggleLike()">
          <mat-icon>{{ post.likedByCurrentUser ? 'favorite' : 'favorite_border' }}</mat-icon>
          <span class="count">{{ post.likeCount || 0 }}</span>
        </button>
        
        <button mat-button class="action-btn" (click)="showComments.set(!showComments())">
          <mat-icon>chat_bubble_outline</mat-icon>
          <span class="count">{{ post.commentCount || 0 }}</span>
        </button>
      </mat-card-actions>

      @if (showComments()) {
        <app-comments [postId]="post.id" 
        (commentAdded) = "post.commentCount += 1" >
        </app-comments>
      }
    </mat-card>
  `,
})
export class PostCardComponent {
    @Input({ required: true }) post!: Post;
    @Output() deletedPost = new EventEmitter<Post>();
    
    showComments = signal(false);

    private postService = inject(PostService);
    private adminService = inject(AdminService);
    private dialog = inject(MatDialog);

    toggleLike() {
        const previousState = this.post.likedByCurrentUser;
        this.post.likedByCurrentUser = !previousState;
        this.post.likeCount += this.post.likedByCurrentUser ? 1 : -1;

        this.postService.likePost(this.post.id).subscribe({
            error: () => {
                this.post.likedByCurrentUser = previousState;
                this.post.likeCount += previousState ? 1 : -1; 
            }
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
                    next: () => alert('Report submitted'),
                    error: () => alert('Failed to report')
                });
            }
        });
    }
    onDelete() {
        this.postService.deletePost(this.post.id).subscribe(()=> this.deletedPost.emit(this.post));
    }
}