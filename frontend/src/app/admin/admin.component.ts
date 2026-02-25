import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AdminService } from '../admin.service';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-admin',
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatTableModule,
        MatButtonModule,
        MatIconModule,
        MatTabsModule,
        MatPaginatorModule,
        MatSlideToggleModule,
        DatePipe
    ],
    templateUrl: `./admin.component.html`,
    styleUrl: `./admin.component.css`
})
export class AdminComponent implements OnInit {
    reports: any[] = [];
    users: any[] = [];

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
        this.totalUsers = 0;
        this.totalPosts = 0;
        this.pendingReports = 0;

        this.adminService.getReports().subscribe(reports => {
            this.reports = reports;
            this.pendingReports = reports.length;
        });

        this.adminService.getUsers().subscribe(users => {
            this.users = users;
            this.totalUsers = users.length;
        });
    }

    resolveReport(report: any) {
        if (!confirm('Are you sure you want to dismiss this report?')) return;
        this.reports = this.reports.filter(r => r.id !== report.id);
    }

    banEntity(report: any) {
        if (!confirm('Are you sure you want to ban/unban this user?')) return;
        if (report.reportedUser) {
            this.toggleBan(report.reportedUser);
        } else if (report.reportedPost) {
            this.adminService.deletePost(report.reportedPost.id).subscribe(() => {
                this.reports = this.reports.filter(r => r.id !== report.id);
                this.loadDashboardData(); 
            });
        }
    }

    toggleBan(user: any) {
        if (!confirm(`Are you sure you want to ${user.banned ? 'unban' : 'ban'} this user?`)) return;
        this.adminService.banUser(user.id).subscribe(() => {
            user.banned = !user.banned;
        });
    }

    hidePost(reportedPostId : number){
        if (!confirm('Are you sure you want to hide this post?')) return;
        this.adminService.hidePost(reportedPostId).subscribe(()=>{console.log("hide done!")});
    }

    unHidePost(reportedPostId : number){
        if (!confirm('Are you sure you want to unhide this post?')) return;
        this.adminService.unHidePost(reportedPostId).subscribe(()=>{console.log("unhide done!")});
    }

    deletePost(id: number){
        if (!confirm('Are you sure you want to permanently delete this post?')) return;
        this.adminService.deletePost(id).subscribe(()=> {
            console.log("post deleted!");
            this.reports = this.reports.filter(r => r.reportedPostId !== id);
        });
    }
}