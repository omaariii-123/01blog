import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { PostService, Post } from '../post.service';
import { UserService } from '../user.service';
import { AuthService } from '../auth.service';
import { AdminService } from '../admin.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PostCardComponent } from '../shared/post-card/post-card.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ReportDialogComponent } from '../shared/report-dialog/report-dialog.component';
import { SecureMediaPipe } from '../shared/secure-media.pipe';

@Component({
  selector: 'app-block',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatCardModule,
    MatTooltipModule,
    RouterModule,
    PostCardComponent,
    MatDialogModule,
    SecureMediaPipe
  ],
  template: `
    <div class="profile-container">
        <div class="profile-banner">
            <div class="banner-overlay"></div>
        </div>

        <div class="profile-header">
            <div class="avatar-container">
                 <div class="profile-avatar" [style.background-image]="'url(https://api.dicebear.com/9.x/initials/svg?seed=' + username + ')'"></div>
            </div>
            
            <div class="profile-info">
                <h1>{{ username }}</h1>
                <p class="bio">Student Developer | Learning Angular & Java | Building cool things.</p>
                
                <div class="stats-row">
                    <div class="stat-item">
                        <span class="count">{{ followersCount }}</span>
                        <span class="label">Followers</span>
                    </div>
                    <div class="stat-item">
                        <span class="count">{{ followingCount }}</span>
                        <span class="label">Following</span>
                    </div>
                </div>

                <div class="profile-actions">
                    @if (isOwner) {
                        <button mat-stroked-button color="primary">
                            <mat-icon>edit</mat-icon> Edit Profile
                        </button>
                    } @else if (username) {
                        <button mat-raised-button [color]="isFollowing ? 'basic' : 'primary'" (click)="toggleFollow()">
                            {{ isFollowing ? 'Unsubscribe' : 'Subscribe' }}
                        </button>
                        <button mat-icon-button color="warn" matTooltip="Report User" (click)="reportUser()">
                            <mat-icon>flag</mat-icon>
                        </button>
                    }
                </div>
            </div>
        </div>

        <div class="profile-content">
            <mat-tab-group mat-stretch-tabs="false" mat-align-tabs="center" animationDuration="0ms">
                <mat-tab label="Timeline">
                    <div class="tab-content">
                        @for (post of posts(); track post.id) {
                            <app-post-card [post]="post"></app-post-card>
                        } @empty {
                            <div class="empty-state">
                                <mat-icon>article</mat-icon>
                                <h3>No posts yet</h3>
                            </div>
                        }
                    </div>
                </mat-tab>
                <mat-tab label="Media">
                    <div class="tab-content media-grid">
                         @for (post of mediaPosts; track post.id) {
                             <div class="media-item">
                                 @if (post.mediaType === 'VIDEO') {
                                     <video [src]="post.mediaUrl | secureMedia" muted autoplay loop playsinline class="media-thumb"></video>
                                 } @else {
                                     <img [src]="post.mediaUrl | secureMedia" alt="Media" class="media-thumb">
                                 }
                             </div>
                         } @empty {
                            <div class="empty-state">
                                <mat-icon>image</mat-icon>
                                <h3>No media uploaded</h3>
                            </div>
                         }
                    </div>
                </mat-tab>
                <mat-tab label="About">
                     <div class="tab-content about-section">
                        <mat-card>
                            <mat-card-content>
                                <h3>Academic Background</h3>
                                <p>Computer Science Student at Example University.</p>
                                
                                <h3 class="mt-4">Skills</h3>
                                <div class="skills-list">
                                    <span class="skill-tag">Java</span>
                                    <span class="skill-tag">Spring Boot</span>
                                    <span class="skill-tag">Angular</span>
                                    <span class="skill-tag">Docker</span>
                                </div>
                            </mat-card-content>
                        </mat-card>
                     </div>
                </mat-tab>
            </mat-tab-group>
        </div>
    </div>
  `,
  styles: [`
    .profile-container {
        background-color: var(--bg-color);
        min-height: 100vh;
    }

    .profile-banner {
        height: 250px;
        background: linear-gradient(120deg, var(--primary-color), var(--secondary-color));
        position: relative;
    }
    
    .banner-overlay {
        position: absolute;
        top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0,0,0,0.1);
    }

    .profile-header {
        max-width: 900px;
        margin: 0 auto;
        padding: 0 20px;
        position: relative;
        text-align: center;
        margin-top: -60px;
    }

    .avatar-container {
        display: inline-block;
        padding: 4px;
        background: var(--bg-color);
        border-radius: 50%;
        position: relative;
        z-index: 2;
    }

    .profile-avatar {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        background-color: #ddd;
        background-size: cover;
        border: 4px solid white;
    }

    .profile-info {
        margin-top: 16px;
    }
    
    .profile-info h1 {
        margin: 0;
        font-size: 2rem;
        font-weight: 700;
        color: var(--text-primary);
    }
    
    .bio {
        color: var(--text-secondary);
        margin: 8px 0 16px;
    }

    .stats-row {
        display: flex;
        justify-content: center;
        gap: 32px;
        margin-bottom: 24px;
    }

    .stat-item {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .stat-item .count {
        font-weight: 700;
        font-size: 1.2rem;
        color: var(--text-primary);
    }

    .stat-item .label {
        font-size: 0.85rem;
        color: var(--text-secondary);
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    
    .profile-actions {
        display: flex;
        justify-content: center;
        gap: 12px;
        margin-bottom: 32px;
    }

    .profile-content {
        max-width: 800px;
        margin: 0 auto;
    }

    .tab-content {
        padding: 24px 0;
    }
    
    .media-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 16px;
    }
    
    .media-item {
        aspect-ratio: 1;
        background: #f0f0f0;
        border-radius: 8px;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .media-thumb {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    
    .skills-list {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 8px;
    }
    
    .skill-tag {
        background: #e0e0e0;
        padding: 4px 12px;
        border-radius: 16px;
        font-size: 0.9rem;
    }
    
    .mt-4 { margin-top: 16px; }

    .empty-state {
        text-align: center;
        padding: 40px;
        color: var(--text-secondary);
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    
    .empty-state mat-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        opacity: 0.5;
        margin-bottom: 16px;
    }
  `]
})
export class BlockComponent implements OnInit {
  username: string = '';
  posts : WritableSignal<Post[]> = signal([]);
  isOwner: boolean = false;
  isFollowing: boolean = false;
  followersCount: number = 0;
  followingCount: number = 0;
  userProfile: any = null;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private postService = inject(PostService);
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private adminService = inject(AdminService);
  private dialog = inject(MatDialog);

  get mediaPosts() {
    return this.posts().filter(p => p.mediaUrl);
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.username = params.get('username') || '';
      if (!this.username) {
        this.router.navigate(['/']); 
        return;
      }
      this.checkOwnership();
      this.loadProfileData();
    });
  }

  checkOwnership() {
    this.isOwner = this.authService.currentUser() === this.username;
  }

  loadProfileData() {
    this.postService.getUserPosts(this.username).subscribe({
      next: (posts: Post[]) => {
        this.posts.set( posts);
      },
      error: (e: any) => console.error(e)
    });

    this.userService.getUserProfile(this.username).subscribe((profile: any) => {
      this.userProfile = profile;
      if (profile) {
        this.userService.getFollowersCount(this.username).subscribe((count: number) => this.followersCount = count);
        this.userService.getFollowingCount(this.username).subscribe((count: number) => this.followingCount = count);

        if (!this.isOwner && this.authService.currentUser()) {
          this.userService.isFollowing(profile.id).subscribe((res: { isFollowing: boolean }) => this.isFollowing = res.isFollowing);
        }
      }
    });
  }

  toggleFollow() {
    if (!this.userProfile) return;

    if (this.isFollowing) {
      this.userService.unfollowUser(this.userProfile.id).subscribe(() => {
        this.isFollowing = false;
        this.followersCount--;
      });
    } else {
      this.userService.followUser(this.userProfile.id).subscribe(() => {
        this.isFollowing = true;
        this.followersCount++;
      });
    }
  }

  reportUser() {
    if (!this.userProfile) return;

    const dialogRef = this.dialog.open(ReportDialogComponent, {
      width: '400px',
      data: { type: 'User', id: this.userProfile.id }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.adminService.createReport(this.userProfile.id, null, result).subscribe({
          next: () => alert('Report submitted successfully.'),
          error: () => alert('Failed to submit report.')
        });
      }
    });
  }
}