import { Component, inject } from '@angular/core';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-dash',
  imports: [],
  templateUrl: './dash.html',
  styleUrl: './dash.css'
})
export class Dash {
	auth = inject(AuthService);
	name = this.auth.user()?.name;
}
