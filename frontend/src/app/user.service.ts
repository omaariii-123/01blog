import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UserProfile {
    id: number;
    username: string;
    role: string;
}

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private apiUrl = 'http://localhost:8080/api/v1/users';
    private http = inject(HttpClient);

    getUserProfile(username: string): Observable<UserProfile> {
        return this.http.get<UserProfile>(`${this.apiUrl}/${username}`);
    }

    followUser(userId: number): Observable<void> {
        return this.http.post<void>(`${this.apiUrl}/${userId}/follow`, {});
    }

    unfollowUser(userId: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${userId}/follow`);
    }

    isFollowing(userId: number): Observable<{ isFollowing: boolean }> {
        return this.http.get<{ isFollowing: boolean }>(`${this.apiUrl}/${userId}/is-following`);
    }

    getFollowersCount(username: string): Observable<number> {
        return this.http.get<number>(`${this.apiUrl}/${username}/followers/count`);
    }

    getFollowingCount(username: string): Observable<number> {
        return this.http.get<number>(`${this.apiUrl}/${username}/following/count`);
    }
}
