import { Component, inject } from '@angular/core';
import {AuthService} from '../../../core/auth/auth.service';
import {PostCreate} from '../../post/post-create/post-create';
import {PostList} from '../../post/post-list/post-list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {PostCard} from '../../post/post-card/post-card';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatCardModule} from '@angular/material/card';


@Component({
  selector: 'app-dash',
  imports: [PostList,
  MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
	PostCard,
MatFormFieldModule, 
MatCardModule,
  ],
  templateUrl: './dash.html',
  styleUrl: './dash.css'
})
export class Dash {
		posts = [
    { authorName: 'Sarah Jenkins', authorAvatar: 'https://i.pravatar.cc/150?img=12', timeAgo: '2 hours ago', imageUrl: 'https://picsum.photos/600/300', content: 'Hiking in the Alps!', likes: 120, comments: 45 },
    { authorName: 'David Lee', authorAvatar: 'https://i.pravatar.cc/150?img=33', timeAgo: '5 hours ago', imageUrl: 'https://picsum.photos/600/301', content: 'Minimalist setup for today.', likes: 85, comments: 12 }
  ];
	auth = inject(AuthService);
	name = this.auth.user()?.name;
}
