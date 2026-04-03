import { Component, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UserProfile, UserService } from '../user.service';

@Component({
  selector: 'app-suggested-users',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <mat-card appearance="outlined" class="suggested-card">
      <mat-card-header>
        <mat-card-title>Suggested for you</mat-card-title>
      </mat-card-header>

      <mat-card-content>
        <div class="suggestion-list">
          @for (user of suggestedUsers(); track user.id) {
          <div class="suggestion-item">
            <div class="avatar-mini"></div>
            <div class="info">
              <span class="name">{{ user.username }}</span>
              <span class="handle">&#64;{{ user.username.toLowerCase() }}</span>
            </div>
            <button
              mat-stroked-button
              color="primary"
              class="follow-btn"
              (click)="followUser(user.id)"
            >
              Follow
            </button>
          </div>
          } @empty {
          <div class="empty-state">
            <p>You follow everyone!</p>
          </div>
          }
        </div>
      </mat-card-content>

      <mat-card-actions class="pagination">
        <button mat-icon-button (click)="prevPage()" [disabled]="currentPage() === 0">
          <mat-icon>chevron_left</mat-icon>
        </button>
        <button mat-icon-button (click)="nextPage()" [disabled]="isLastPage()">
          <mat-icon>chevron_right</mat-icon>
        </button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [
    `
      .suggested-card {
        border-radius: 12px;
        border-color: var(--divider-color);
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
      }

      mat-card-header {
        margin-bottom: 16px;
        padding-top: 16px;
      }

      mat-card-title {
        font-size: 1.1rem;
        font-weight: 600;
      }

      .suggestion-list {
        display: flex;
        flex-direction: column;
      }

      .suggestion-item {
        display: flex;
        align-items: center;
        padding: 12px 0;
        border-bottom: 1px solid var(--divider-color);
      }

      .suggestion-item:last-child {
        border-bottom: none;
      }

      .avatar-mini {
        width: 36px;
        height: 36px;
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

      .follow-btn {
        border-radius: 20px;
      }

      .empty-state {
        text-align: center;
        padding: 20px 0;
        color: var(--text-secondary);
        font-size: 0.9rem;
      }

      .pagination {
        display: flex;
        justify-content: space-between;
        padding: 0 8px 8px 8px;
        border-top: 1px solid var(--divider-color);
      }
    `,
  ],
})
export class SuggestedUsersComponent {
  private userService = inject(UserService);

  suggestedUsers = signal<UserProfile[]>([]);
  currentPage = signal(0);
  isLastPage = signal(false);

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getSuggestedUsers(this.currentPage()).subscribe((res) => {
      this.suggestedUsers.set(res.content);
      res.content.forEach((m) => console.log(m));
      this.isLastPage.set(res.last); // Use the 'last' boolean from Spring Page
    });
  }

  nextPage() {
    this.currentPage.update((p) => p + 1);
    this.loadUsers();
  }

  prevPage() {
    this.currentPage.update((p) => p - 1);
    this.loadUsers();
  }

  followUser(userId: number) {
    this.userService.followUser(userId).subscribe(() => {
      this.suggestedUsers.update((users) => users.filter((u) => u.id !== userId));

      // If the list gets empty after following someone, load the next page automatically
      if (this.suggestedUsers().length === 0 && !this.isLastPage()) {
        this.loadUsers();
      }
    });
  }
}
