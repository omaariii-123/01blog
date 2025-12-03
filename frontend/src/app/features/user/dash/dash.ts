import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/auth/auth.service';
import { NavigationService } from '../../../core/nav/nav.service';
import { PostService } from '../../post/services/post.service';
import { PostCreateComponent } from '../../post/post-create/post-create';

@Component({
  selector: 'app-dash',
  standalone: true,
  imports: [CommonModule, PostCreateComponent],
  templateUrl: './dash.html',
  styleUrl: './dash.css'
})
export class Dash implements OnInit {
  auth = inject(AuthService);
  nav = inject(NavigationService);
  postService = inject(PostService);

  posts = this.postService.posts;

  get name() {
    return this.auth.user()?.name;
  }

  ngOnInit() {
    this.postService.getPosts().subscribe();
  }

  goProfile() {
    this.nav.goToProfile();
  }
}
