import { Component, inject } from '@angular/core';
import {AuthService} from '../../../core/auth/auth.service';
import {PostCreate} from '../../post/post-create/post-create';

@Component({
  selector: 'app-dash',
  imports: [PostCreate],
  templateUrl: './dash.html',
  styleUrl: './dash.css'
})
export class Dash {
	auth = inject(AuthService);
	name = this.auth.user()?.name;
}
