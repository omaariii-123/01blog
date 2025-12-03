import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/auth/auth.service';
import { NavigationService } from '../../../core/nav/nav.service';
// Importing the component we created in the previous step
import { PostCreateComponent } from '../../post/post-create/post-create';

@Component({
  selector: 'app-dash',
  standalone: true,
  imports: [CommonModule, PostCreateComponent],
  templateUrl: './dash.html',
  styleUrl: './dash.css'
})
export class Dash {
  auth = inject(AuthService);
  nav = inject(NavigationService);
  
  // Using a getter ensures we always have the latest name if the user signal updates
  get name() {
    return this.auth.user()?.name;
  }
  goProfile(){
  	this.nav.goToProfile();
  }
}
