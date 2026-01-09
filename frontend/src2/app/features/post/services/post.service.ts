import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Post } from '../post.model';

@Injectable({
    providedIn: 'root'
})
export class PostService {
    private apiUrl = 'http://localhost:8080/api/posts';
    private http = inject(HttpClient);

    // Signal to hold the list of posts
    posts = signal<Post[]>([]);

    getPosts(): Observable<Post[]> {
        return this.http.post<Post[]>(this.apiUrl + "/get",{}, { withCredentials: true }).pipe(
            tap(posts => this.posts.set(posts))
        );
    }

    getPost(id: string): Observable<Post> {
        return this.http.post<Post>(`${this.apiUrl + "/get"}/${id}`, { withCredentials: true });
    }

    createPost(post: Post): Observable<Post> {
        return this.http.post<Post>(this.apiUrl + "/create", post, { withCredentials: true }).pipe(
            tap(newPost => {
                this.posts.update(posts => [...posts, newPost]);
            })
        );
    }

    updatePost(post: Post): Observable<Post> {
        return this.http.put<Post>(`${this.apiUrl}/${post.id}`, post, { withCredentials: true }).pipe(
            tap(updatedPost => {
                this.posts.update(posts => posts.map(p => p.id === updatedPost.id ? updatedPost : p));
            })
        );
    }

    deletePost(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`, { withCredentials: true }).pipe(
            tap(() => {
                this.posts.update(posts => posts.filter(p => p.id !== id)); // Lint fixed
            })
        );
    }
}
