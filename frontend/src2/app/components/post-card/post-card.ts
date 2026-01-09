import { Component, input } from '@angular/core';
import { Post } from '../../models/post.model';
import { MATERIAL_MODULES } from '../../shared/material';

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [...MATERIAL_MODULES],
  template: `
    <mat-card class="post-card">
      <mat-card-header>
        <div mat-card-avatar class="header-image" 
             [style.background-image]="'url(' + post().authorAvatar + ')'"></div>
        <mat-card-title>{{ post().authorName }}</mat-card-title>
        <mat-card-subtitle>{{ post().timeAgo }}</mat-card-subtitle>
        <span class="spacer"></span>
        <button mat-icon-button><mat-icon>more_vert</mat-icon></button>
      </mat-card-header>

      @if (post().imageUrl) {
        <img mat-card-image [src]="post().imageUrl" alt="Post Content">
      }

      <mat-card-content>
        <p>{{ post().content }}</p>
      </mat-card-content>

      <mat-card-actions>
        <button mat-button color="accent"><mat-icon>favorite</mat-icon> {{ post().likes }}</button>
        <button mat-button><mat-icon>comment</mat-icon> {{ post().comments }}</button>
        <span class="spacer"></span>
        <button mat-button color="warn">REPORT</button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [`
    .post-card { max-width: 600px; margin: 0 auto 20px auto; }
    .header-image { background-size: cover; background-position: center; }
    mat-card-content { margin-top: 12px; font-size: 14px; line-height: 1.5; }
    mat-card-actions { border-top: 1px solid #eee; }
  `]
})
export class PostCardComponent {
  // Signal Input (The new standard)
  post = input.required<Post>(); 
}
