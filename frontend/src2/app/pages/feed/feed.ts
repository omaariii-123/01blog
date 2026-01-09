import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { PostService } from '../../services/post.service';
import { PostCardComponent } from '../../components/post-card/post-card';
import { MATERIAL_MODULES } from '../../shared/material';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [PostCardComponent, ...MATERIAL_MODULES],
  template: `
    <div class="feed-container">
      <mat-card class="composer">
        <mat-form-field appearance="outline" class="full-width no-bottom">
          <mat-label>What's on your mind?</mat-label>
          <textarea matInput rows="2"></textarea>
        </mat-form-field>
        <div class="composer-actions">
          <button mat-icon-button color="primary"><mat-icon>image</mat-icon></button>
          <button mat-icon-button color="primary"><mat-icon>place</mat-icon></button>
          <span class="spacer"></span>
          <button mat-raised-button color="primary">POST</button>
        </div>
      </mat-card>

      @for (post of posts(); track post.id) {
        <app-post-card [post]="post" />
      } @empty {
        <p class="text-center">No posts yet!</p>
      }
    </div>
  `,
  styles: [`
    .feed-container { max-width: 600px; margin: 80px auto 20px; padding: 0 10px; }
    .composer { margin-bottom: 24px; padding: 16px; }
    .composer-actions { display: flex; align-items: center; margin-top: 5px; }
    ::ng-deep .no-bottom .mat-mdc-form-field-subscript-wrapper { display: none; }
  `]
})
export class FeedComponent {
  private postService = inject(PostService);
  // Converts Observable to Signal immediately
  posts = toSignal(this.postService.getPosts(), { initialValue: [] });
}
