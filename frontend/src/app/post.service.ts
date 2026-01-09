import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Post {
    id: number;
    author: string;
    description: string;
    mediaUrl?: string;
    mediaType?: 'IMAGE' | 'VIDEO';
    createdAt: string;
    likeCount: number;
    likedByCurrentUser: boolean;
    comments?: Comment[]; // Optional for UI expansion
}

export interface Comment {
    id: number;
    postId: number;
    author: string;
    content: string;
    createdAt: string;
}

@Injectable({
    providedIn: 'root'
})
export class PostService {
    private apiUrl = 'http://localhost:8080/api/v1/posts'; // Validated backend route
    private interactionUrl = 'http://localhost:8080/api/v1/interactions'; // Need to verify interaction route

    private http = inject(HttpClient);

    getAllPosts(): Observable<Post[]> {
        return this.http.get<Post[]>(this.apiUrl);
    }

    getUserPosts(username: string): Observable<Post[]> {
        return this.http.get<Post[]>(`${this.apiUrl}/user/${username}`);
    }

    deletePost(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    createPost(description: string, file?: File): Observable<Post> {
        const formData = new FormData();
        if (description) formData.append('description', description);
        if (file) formData.append('file', file);

        return this.http.post<Post>(this.apiUrl, formData);
    }

    getComments(postId: number): Observable<Comment[]> {
        return this.http.get<Comment[]>(`${this.interactionUrl}/comments/${postId}`);
    }

    addComment(postId: number, content: string): Observable<Comment> {
        return this.http.post<Comment>(`${this.interactionUrl}/comments/${postId}`, { content });
    }

    likePost(postId: number): Observable<void> {
        return this.http.post<void>(`${this.interactionUrl}/likes/${postId}`, {});
    }

    getLikeCount(postId: number): Observable<number> {
        return this.http.get<number>(`${this.interactionUrl}/likes/${postId}/count`);
    }
}
