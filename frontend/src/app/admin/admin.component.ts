import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router'; // Crucial for clickable links
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AdminService, Report, User } from '../admin.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatPaginatorModule,
    MatSlideToggleModule,
    DatePipe,
  ],
  templateUrl: `./admin.component.html`,
  styleUrl: `./admin.component.css`,
})
export class AdminComponent implements OnInit {
  reports: Report[] = [];
  users: User[] = [];

  totalUsers = 0;
  totalPosts = 0;
  pendingReports = 0;

  reportColumns = ['id', 'reporter', 'reason', 'status', 'time', 'actions'];
  userColumns = ['username', 'role', 'actions'];

  private adminService = inject(AdminService);

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.adminService.getReports().subscribe({
      next: (reports) => {
        this.reports = reports || [];
        this.pendingReports = this.reports.length;
      },
      error: (err) => console.error('Error loading reports:', err),
    });

    this.adminService.getUsers().subscribe({
      next: (users) => {
        this.users = users || [];
        this.totalUsers = this.users.length;
      },
      error: (err) => console.error('Error loading users:', err),
    });
  }

  resolveReport(report: Report) {
    if (!confirm('Are you sure you want to dismiss this report?')) return;

    // Remove it from the table UI
    this.reports = this.reports.filter((r) => r.id !== report.id);
    this.pendingReports = this.reports.length;
  }

  banEntity(report: Report) {
    if (!confirm('Are you sure you want to take action on this report?')) return;

    if (report.reportedUserId) {
      this.adminService.banUser(report.reportedUserId).subscribe({
        next: () => {
          // Update the users table if they are on the same page
          const userInList = this.users.find((u) => u.id === report.reportedUserId);
          if (userInList) userInList.banned = true;

          this.resolveReport(report); // Clear it from reports list
        },
        error: (err) => alert('Failed to ban user'),
      });
    } else if (report.reportedPostId) {
      this.adminService.deletePost(report.reportedPostId).subscribe({
        next: () => {
          this.reports = this.reports.filter((r) => r.reportedPostId !== report.reportedPostId);
          this.pendingReports = this.reports.length;
        },
        error: (err) => alert('Failed to delete post'),
      });
    }
  }

  toggleBan(user: User) {
    if (!confirm(`Are you sure you want to ${user.banned ? 'unban' : 'ban'} this user?`)) return;
    this.adminService.banUser(user.id).subscribe({
      next: () => {
        user.banned = !user.banned;
      },
      error: (err) => alert('Failed to change ban status'),
    });
  }

  hidePost(reportedPostId: number) {
    if (!confirm('Are you sure you want to hide this post?')) return;
    this.adminService.hidePost(reportedPostId).subscribe({
      next: () => console.log('Post hidden!'),
      error: (err) => alert('Failed to hide post'),
    });
  }

  unHidePost(reportedPostId: number) {
    if (!confirm('Are you sure you want to unhide this post?')) return;
    this.adminService.unHidePost(reportedPostId).subscribe({
      next: () => console.log('Post unhidden!'),
      error: (err) => alert('Failed to unhide post'),
    });
  }

  deletePost(id: number) {
    if (!confirm('Are you sure you want to permanently delete this post?')) return;
    this.adminService.deletePost(id).subscribe({
      next: () => {
        // Clear any reports associated with this deleted post
        this.reports = this.reports.filter((r) => r.reportedPostId !== id);
        this.pendingReports = this.reports.length;
      },
      error: (err) => alert('Failed to delete post'),
    });
  }
}
