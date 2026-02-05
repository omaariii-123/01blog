import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from './post.service';

export interface User {
    id: number;
    username: string;
    role: 'USER' | 'ADMIN';
    banned: boolean;
}

export interface Report {
    id: number;
    reporter?: User;
    reportedUser?: User;
    reportedPost?: Post;
    reason: string;
    createdAt: string;
}

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    private apiUrl = 'http://localhost:8080/api/v1/admin';
    private http = inject(HttpClient);

    getUsers(): Observable<User[]> {
        return this.http.get<User[]>(`${this.apiUrl}/users`);
    }

    getReports(): Observable<Report[]> {
        return this.http.get<Report[]>(`${this.apiUrl}/reports`);
    }

    banUser(id: number): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/users/${id}/ban`, {});
    }

    deletePost(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/posts/${id}`);
    }
    hidePost(id : number){
         return this.http.put<Report>(`${this.apiUrl}/posts/hide/${id}`, {})
    }
    unHidePost(id : number){
         return this.http.put<Report>(`${this.apiUrl}/posts/unhide/${id}`, {})
    }

    createReport(userId: number | null, postId: number | null, reason: string): Observable<void> {
        const params: any = { reason };
        if (userId) params.userId = userId;
        if (postId) params.postId = postId;

        // Pass params as query parameters since backend expects @RequestParam
        return this.http.post<void>(`${this.apiUrl}/report`, {}, { params });
    }
}
