import { Component, Input, Output, EventEmitter, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PostService, Comment } from '../../post.service';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  template: `
    <div class="comments-container">
      <div class="comment-input-area">
        <input #box
          type="text" 
          [value]="newComment()"
          (input)="newComment.set(box.value)"
          placeholder="Write a comment..." 
          (keyup.enter)="addComment()"
          [disabled]="isSubmitting()">
        
        <button mat-icon-button color="primary" (click)="addComment()" [disabled]="!newComment() || isSubmitting()">
            @if (isSubmitting()) {
                <mat-spinner diameter="20"></mat-spinner>
            } @else {
                <mat-icon>send</mat-icon>
            }
        </button>
      </div>

      <div class="comments-list">
        @for (comment of comments(); track comment.id) {
          <div class="comment-item">
            <span class="comment-author">{{ comment.author }}</span>
            <span class="comment-content">{{ comment.content }}</span>
          </div>
        }
      </div>

      @if (hasMore()) {
        <button mat-button class="load-more-btn" (click)="loadMore()" [disabled]="isLoading()">
          {{ isLoading() ? 'Loading...' : 'View more comments' }}
        </button>
      }
    </div>
  `,
  styles: [`
    .comments-container {
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
    .load-more-btn {
      width: 100%;
      margin-top: 8px;
      font-size: 0.85rem;
      color: var(--text-secondary);
    }
  `]
})
export class CommentsComponent {
  @Input({ required: true }) postId!: number;
  @Output() commentAdded = new EventEmitter<void>();
  private postService = inject(PostService);
  
  // Signals for Reactive State
  comments = signal<Comment[]>([]);
  isLoading = signal(false);
  isSubmitting = signal(false);
  hasMore = signal(true); // Assuming there might be more initially
  
  newComment = signal('');
  page = 0;
  readonly PAGE_SIZE = 5;

  ngOnInit() {
    this.loadMore();
  }

  loadMore() {
    if (this.isLoading()) return;

    this.isLoading.set(true);
    
    // Assuming your service supports pagination: getComments(postId, page, size)
    this.postService.getComments(this.postId).subscribe({
      next: (newComments) => {
        this.comments.update(current => [...current, ...newComments]);
        // If we got fewer comments than requested, we reached the end
        if (newComments.length < this.PAGE_SIZE) {
            this.hasMore.set(false);
        }
        
        this.page++;
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  addComment() {
    if (!this.newComment().trim()) return;
    
    this.isSubmitting.set(true);
    
    this.postService.addComment(this.postId, this.newComment()).subscribe({
      next: (comment) => {
        // Optimistic: Add to TOP of list
        this.comments.update(c => [comment, ...c]);
        this.commentAdded.emit();
        this.newComment.set('');
        this.isSubmitting.set(false);
      },
      error: () => this.isSubmitting.set(false)
    });
  }
}