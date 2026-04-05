import { Component, inject, OnInit, OnDestroy } from '@angular/core';
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
    MatBadgeModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit, OnDestroy {
  // Services are public so they can be accessed directly in the HTML
  public authService = inject(AuthService);
  public notificationService = inject(NotificationService);

  private pollInterval: any;

  ngOnInit() {
    this.refresh();

    // Polling is fine for a junior project, just keep it clean
    this.pollInterval = setInterval(() => this.refresh(), 5000);
  }

  ngOnDestroy() {
    if (this.pollInterval) clearInterval(this.pollInterval);
  }

  private refresh() {
    if (this.authService.isLoggedIn()) {
      // The service .tap() will update the signals automatically
      this.notificationService.getNotifications().subscribe();
    }
  }

  markAsRead(id: number) {
    this.notificationService.markAsRead(id).subscribe();
  }

  logout() {
    this.authService.logout();
    // No need to manually clear signals here if the service handles it,
    // but the next refresh() will fail and stop updates anyway.
  }
}
