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

    reportColumns = ['id', 'reporter', 'reason', 'status', 'actions'];
    userColumns = ['username', 'role', 'actions'];

    private adminService = inject(AdminService);

    ngOnInit() {
        this.loadDashboardData();
    }

    loadDashboardData() {
        // Mock data for initial visual check (API implementation varies)
        // Real implementation should call adminService.getReports(), adminService.getUsers()

        // Placeholder until backend API confirmed or implemented completely for stats
        this.totalUsers = 0;
        this.totalPosts = 0;
        this.pendingReports = 0;

        this.adminService.getReports().subscribe(reports => {
            this.reports = reports;
            this.reports.forEach((r)=> console.log(r))
            this.pendingReports = reports.length;
        });

        this.adminService.getUsers().subscribe(users => {
            this.users = users;
            this.totalUsers = users.length;
        });
    }

    resolveReport(report: any) {
        // Since we don't have a resolve endpoint, we might just need to delete the report or mark it resolved if backend supported it.
        // For now, assuming "Dismiss" means deleting the report/ignoring it? 
        // Or if backend has status update. AdminService doesn't show update status method.
        // Let's assume we can't do much without backend support for status change, 
        // but user asked for "report not working", meaning submission.
        // If this is for "Dismiss", maybe we just remove it from UI?
        this.reports = this.reports.filter(r => r.id !== report.id);
    }

    banEntity(report: any) {
        /*
        if (report.reportedUser) {
            this.toggleBan(report.reportedUser);
        } else if (report.reportedPost) {
            this.adminService.deletePost(report.reportedPost.id).subscribe(() => {
                this.reports = this.reports.filter(r => r.id !== report.id);
                this.loadDashboardData(); // Refresh stats
            });
        }*/
    }

    toggleBan(user: any) {
        this.adminService.banUser(user.id).subscribe(() => {
            user.banned = !user.banned;
        });
    }
    hidePost(reportedPostId : number){
        this.adminService.hidePost(reportedPostId).subscribe(()=>{console.log("hide done!")});
    }
    unHidePost(reportedPostId : number){
        this.adminService.unHidePost(reportedPostId).subscribe(()=>{console.log("unhide done!")});
    }
}
