import { Component } from '@angular/core';
import { MATERIAL_MODULES } from '../../shared/material';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [...MATERIAL_MODULES],
  template: `
    <div class="container" style="margin-top: 60px;">
      <mat-card class="profile-header">
        <div class="banner"></div>
        <div class="profile-body">
          <div class="avatar-container">
            <img src="https://i.pravatar.cc/150?img=12" alt="Avatar">
          </div>
          <div class="info">
            <h1>Sarah Jenkins</h1>
            <p class="bio">Photographer & Traveler. Capturing the world.</p>
            <div class="stats">
              <span><strong>1.2k</strong> Followers</span>
              <span><strong>450</strong> Following</span>
            </div>
          </div>
          <button mat-raised-button color="accent" class="sub-btn">Subscribe</button>
        </div>
      </mat-card>

      <h3>Recent Posts</h3>
      <div class="grid">
        @for (item of galleryItems; track item) {
          <div class="grid-item">
            <img [src]="'https://picsum.photos/300/300?random=' + item" alt="Post">
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .profile-header { padding: 0; overflow: hidden; margin-bottom: 30px; }
    .banner { height: 160px; background: linear-gradient(135deg, #3f51b5, #64b5f6); }
    .profile-body { position: relative; padding: 0 24px 24px; display: flex; flex-wrap: wrap; }
    .avatar-container { margin-top: -60px; margin-right: 20px; }
    .avatar-container img { width: 120px; height: 120px; border-radius: 50%; border: 5px solid white; object-fit: cover; }
    .info { margin-top: 10px; flex: 1; min-width: 200px; }
    .info h1 { margin: 0 0 5px 0; font-size: 24px; }
    .bio { color: #666; margin-bottom: 10px; }
    .stats span { margin-right: 15px; }
    .sub-btn { align-self: center; margin-top: 10px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px; }
    .grid-item img { width: 100%; height: 200px; object-fit: cover; border-radius: 4px; }
  `]
})
export class UserProfileComponent {
  galleryItems = [1, 2, 3, 4, 5, 6];
}
