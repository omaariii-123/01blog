import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
export class CommentService {
    private apiUrl = 'http://localhost:8080/api/v1/posts'; // Validated backend route
    private interactionUrl = 'http://localhost:8080/api/v1/interactions'; // Need to verify interaction route

    private http = inject(HttpClient);


    getComments(postId: number): Observable<Comment[]> {
        return this.http.get<Comment[]>(`${this.interactionUrl}/comments/${postId}`);
    }

    addComment(postId: number, content: string): Observable<Comment> {
        return this.http.post<Comment>(`${this.interactionUrl}/comments/${postId}`, { content });
    }
}
