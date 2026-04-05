import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AdminService, Report, User } from '../admin.service';
import { Post } from '../post.service';

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
  reports = signal<Report[]>([]);
  users = signal<User[]>([]);
  posts = signal<Post[]>([]);

  // These will automatically recalculate anytime the arrays change
  totalUsers = computed(() => this.users().length);
  totalPosts = computed(() => this.posts().length);
  pendingReports = computed(() => this.reports().length);

  reportColumns = ['id', 'reporter', 'reason', 'status', 'time', 'actions'];
  userColumns = ['username', 'role', 'actions'];
  postColumns = ['id', 'author', 'content', 'status', 'time', 'actions'];

  private adminService = inject(AdminService);

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.adminService.getReports().subscribe({
      next: (data) => this.reports.set(data || []),
      error: (err) => console.error('Error loading reports:', err),
    });

    this.adminService.getUsers().subscribe({
      next: (data) => this.users.set(data || []),
      error: (err) => console.error('Error loading users:', err),
    });

    this.adminService.getPosts().subscribe({
      next: (data) => this.posts.set(data || []),
      error: () => {},
    });
  }

  resolveReport(report: Report) {
    if (!confirm('Are you sure you want to dismiss this report?')) return;
    this.reports.update((current) => current.filter((r) => r.id !== report.id));
  }

  banEntity(report: Report) {
    if (!confirm('Are you sure you want to take action on this report?')) return;

    if (report.reportedUserId) {
      this.adminService.banUser(report.reportedUserId).subscribe({
        next: () => {
          this.users.update((current) =>
            current.map((u) => (u.id === report.reportedUserId ? { ...u, banned: true } : u))
          );
          this.resolveReport(report);
        },
        error: () => alert('Failed to ban user'),
      });
    } else if (report.reportedPostId) {
      this.adminService.deletePost(report.reportedPostId).subscribe({
        next: () => {
          this.reports.update((current) =>
            current.filter((r) => r.reportedPostId !== report.reportedPostId)
          );
        },
        error: () => alert('Failed to delete post'),
      });
    }
  }

  toggleBan(user: User) {
    if (!confirm(`Are you sure you want to ${user.banned ? 'unban' : 'ban'} this user?`)) return;
    this.adminService.banUser(user.id).subscribe({
      next: () => {
        this.users.update((current) =>
          current.map((u) => (u.id === user.id ? { ...u, banned: !u.banned } : u))
        );
      },
      error: () => alert('Failed to change ban status'),
    });
  }

  togglePostVisibility(post: Post, event: any) {
    const action = post.hidden ? 'unhide' : 'hide';

    // 1. If they cancel the popup, force the toggle to snap back
    if (!confirm(`Are you sure you want to ${action} this post?`)) {
      event.source.checked = post.hidden;
      return;
    }

    // 2. If it is currently hidden, Unhide it
    if (post.hidden) {
      this.adminService.unHidePost(post.id).subscribe({
        next: () => {
          this.posts.update((current) =>
            current.map((p) => (p.id === post.id ? { ...p, hidden: false } : p))
          );
        },
        error: () => {
          alert('Failed to unhide post');
          event.source.checked = post.hidden; // Snap back if backend fails
        },
      });
    }
    // 3. If it is currently visible, Hide it
    else {
      this.adminService.hidePost(post.id).subscribe({
        next: () => {
          this.posts.update((current) =>
            current.map((p) => (p.id === post.id ? { ...p, hidden: true } : p))
          );
        },
        error: () => {
          alert('Failed to hide post');
          event.source.checked = post.hidden; // Snap back if backend fails
        },
      });
    }
  }
  deleteUser(id: number) {
    if (!confirm('Are you sure you want to permanently delete this user? This cannot be undone.'))
      return;

    this.adminService.deleteUser(id).subscribe({
      next: () => {
        // Remove the user from the table
        this.users.update((current) => current.filter((u) => u.id !== id));

        // Clear any pending reports associated with this deleted user
        this.reports.update((current) =>
          current.filter((r) => r.reportedUserId !== id && r.reporterId !== id)
        );
      },
      error: () => alert('Failed to delete user. They might have dependent records.'),
    });
  }
  deletePost(id: number) {
    if (!confirm('Are you sure you want to permanently delete this post?')) return;
    this.adminService.deletePost(id).subscribe({
      next: () => {
        // Remove the post from the posts array
        this.posts.update((current) => current.filter((p) => p.id !== id));
        // Also clear any reports tied to it
        this.reports.update((current) => current.filter((r) => r.reportedPostId !== id));
      },
      error: () => alert('Failed to delete post'),
    });
  }
}
