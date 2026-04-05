import { Component, Input, Output, inject, signal, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PostService, Post } from '../../post.service';
import { AdminService } from '../../admin.service';
import { ReportDialogComponent } from '../report-dialog/report-dialog.component';
import { CommentsComponent } from '../comments/comments';
import { AuthService } from '../../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SecureMediaDirective } from '../../secure-media.directive';

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [
    CommonModule,
    SecureMediaDirective,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    RouterModule,
    FormsModule,
    CommentsComponent,
  ],
  template: `
    <mat-card class="post-card">
      <mat-card-header>
        <div
          mat-card-avatar
          class="avatar-placeholder"
          [style.background-image]="
            'url(https://api.dicebear.com/9.x/initials/svg?seed=' + post.author + ')'
          "
        ></div>
        <mat-card-title>
          <a [routerLink]="['/block', post.author]" class="author-link">{{ post.author }}</a>
        </mat-card-title>
        <mat-card-subtitle>
          {{ post.createdAt | date : 'mediumDate' }}
        </mat-card-subtitle>
        <span class="spacer"></span>
        <button mat-icon-button [matMenuTriggerFor]="menu">
          <mat-icon>more_vert</mat-icon>
        </button>
        <mat-menu #menu="matMenu">
          @if (post.author === authService.currentUser() || authService.isAdmin() === true) {
          <button mat-menu-item (click)="startEdit()">
            <mat-icon>edit</mat-icon>
            <span>Edit Post</span>
          </button>
          <button mat-menu-item (click)="onDelete()">
            <mat-icon>delete</mat-icon>
            <span>Delete Post</span>
          </button>
          }
          <button mat-menu-item (click)="onReport()">
            <mat-icon>flag</mat-icon>
            <span>Report Post</span>
          </button>
        </mat-menu>
      </mat-card-header>

      <mat-card-content>
        @if (isEditing()) {
        <div class="edit-container" style="margin-bottom: 16px;">
          <textarea
            [(ngModel)]="editDescription"
            rows="3"
            style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid var(--border-color);"
          ></textarea>
          <div style="display: flex; gap: 8px; justify-content: flex-end; margin-top: 8px;">
            <button mat-button (click)="cancelEdit()">Cancel</button>
            <button mat-raised-button color="primary" (click)="saveEdit()">Save Edit</button>
          </div>
        </div>
        } @else {
        <p class="post-text">{{ post.description }}</p>
        } @if (post.mediaUrl) {
        <div class="media-container">
          @if (post.mediaType === 'VIDEO') {
          <video
            [secureMedia]="'http://localhost:8080/uploads/' + post.mediaUrl"
            controls
            width="100%"
            playsinline
            preload="metadata"
          >
            Your browser does not support the video tag.
          </video>
          } @else {
          <img
            [secureMedia]="'http://localhost:8080/uploads/' + post.mediaUrl"
            alt="Post media"
            style="width: 100%; border-radius: 8px;"
          />
          }
        </div>
        }
      </mat-card-content>

      <mat-card-actions align="start">
        <button
          mat-button
          class="action-btn"
          [class.liked]="post.likedByCurrentUser"
          (click)="toggleLike()"
        >
          <mat-icon>{{ post.likedByCurrentUser ? 'favorite' : 'favorite_border' }}</mat-icon>
          <span class="count">{{ post.likeCount || 0 }}</span>
        </button>

        <button mat-button class="action-btn" (click)="showComments.set(!showComments())">
          <mat-icon>chat_bubble_outline</mat-icon>
          <span class="count">{{ post.commentCount || 0 }}</span>
        </button>
      </mat-card-actions>

      @if (showComments()) {
      <app-comments
        [postId]="post.id"
        (commentAdded)="post.commentCount = post.commentCount + 1"
        (commentDeleted)="post.commentCount = post.commentCount - 1"
      >
      </app-comments>
      }
    </mat-card>
  `,
})
export class PostCardComponent {
  @Input({ required: true }) post!: Post;
  @Output() deletedPost = new EventEmitter<Post>();

  showComments = signal(false);
  isEditing = signal(false);
  editDescription = signal('');

  private snackBar = inject(MatSnackBar);

  private postService = inject(PostService);
  private adminService = inject(AdminService);
  private dialog = inject(MatDialog);
  authService = inject(AuthService);

  startEdit() {
    this.editDescription.set(this.post.description);
    this.isEditing.set(true);
  }

  cancelEdit() {
    this.isEditing.set(false);
  }

  saveEdit() {
    this.postService.updatePost(this.post.id, this.editDescription()).subscribe({
      next: (updated) => {
        this.post.description = updated.description;
        this.isEditing.set(false);
      },
    });
  }

  toggleLike() {
    const previousState = this.post.likedByCurrentUser;
    this.post.likedByCurrentUser = !previousState;
    this.post.likeCount += this.post.likedByCurrentUser ? 1 : -1;

    this.postService.likePost(this.post.id).subscribe({
      error: () => {
        this.post.likedByCurrentUser = previousState;
        this.post.likeCount += previousState ? 1 : -1;
      },
    });
  }

  onReport() {
    const dialogRef = this.dialog.open(ReportDialogComponent, {
      width: '400px',
      data: { type: 'Post', id: this.post.id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.adminService.createReport(null, this.post.id, result).subscribe({
          next: () => {
            this.snackBar.open('Repport submitted!', 'Close', {
              duration: 5000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
              panelClass: ['success-snackbar'],
            });
          },
          error: () =>
            this.snackBar.open('faild to Report!', 'Close', {
              duration: 5000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
              panelClass: ['error-snackbar'],
            }),
        });
      }
    });
  }

  onDelete() {
    if (confirm('Are you sure you want to delete this post?')) {
      this.postService.deletePost(this.post.id).subscribe({
        next: () => {
          this.deletedPost.emit(this.post);
          this.snackBar.open('Post deleted !', 'Close', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass: ['success-snackbar'],
          });
        },
        error: (err) => {
          this.snackBar.open('Failed to delete post.', 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar'],
          });
        },
      });
    }
  }
}
