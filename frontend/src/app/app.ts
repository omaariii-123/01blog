import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge';
import { AuthService } from './auth.service';
import { NotificationService, AppNotification } from './notification.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
    MatBadgeModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {
  authService = inject(AuthService);
  notificationService = inject(NotificationService);
  
  notifications = signal<AppNotification[]>([]);
  unreadCount = signal(0);
  
  private pollInterval: any;

  ngOnInit() {
    // Initial check
    this.checkNotifications();

    // Set up real-time polling every 3 seconds
    this.pollInterval = setInterval(() => {
      this.checkNotifications();
    }, 3000);
  }

  ngOnDestroy() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
    }
  }

  // Changed to public so the HTML template can call it safely
  public checkNotifications() {
    if (this.authService.isLoggedIn()) {
      this.notificationService.getNotifications().subscribe({
        next: (nots) => {
          this.notifications.set(nots);
          this.unreadCount.set(nots.filter(n => !n.read).length);
        },
        error: () => {
          // Fail silently in the background so it doesn't spam the console if token expires
        }
      });
    } else {
      // Clear them out if the user logs out
      this.notifications.set([]);
      this.unreadCount.set(0);
    }
  }

  // Force a load when they click the bell, just to be instantaneous
  loadNotifications() {
      this.checkNotifications();
  }

  markAsRead(id: number) {
    this.notificationService.markAsRead(id).subscribe(() => this.checkNotifications());
  }

  logout() {
    this.authService.logout();
    this.notifications.set([]);
    this.unreadCount.set(0);
  }
}