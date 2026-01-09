import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/auth/auth.service';
import { NavigationService } from '../../../core/nav/nav.service';
import { PostService } from '../../post/services/post.service';
import { PostCreateComponent } from '../../post/post-create/post-create';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-dash',
  standalone: true,
  imports: [
    CommonModule,
    PostCreateComponent,
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule
  ],
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
