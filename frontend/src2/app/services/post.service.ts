import { Injectable } from '@angular/core';
import { Post } from '../models/post.model';
import { of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PostService {
  private mockPosts: Post[] = [
    {
      id: 1,
      authorName: 'Sarah Jenkins',
      authorAvatar: 'https://i.pravatar.cc/150?img=12',
      timeAgo: '2 hours ago',
      imageUrl: 'https://picsum.photos/seed/picsum/600/300',
      content: 'Hiking in the Alps! The view is amazing.',
      likes: 120,
      comments: 45
    },
    {
      id: 2,
      authorName: 'David Lee',
      authorAvatar: 'https://i.pravatar.cc/150?img=33',
      timeAgo: '5 hours ago',
      content: 'Just deployed my first Angular app using pure Signals.',
      likes: 85,
      comments: 12
    }
  ];

  getPosts() {
    return of(this.mockPosts);
  }
}
