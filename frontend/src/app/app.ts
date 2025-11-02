import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {AuthService} from './services/auth.service';
import {NavigationService} from './services/nav.service';
import { CommonModule } from '@angular/common';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  imports : [RouterOutlet, CommonModule],
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('01Blog');
  constructor(public nav: NavigationService, public auth: AuthService){}
  goLogin() {
  	this.nav.goToLogin();
  }
  goSignUp() {
  	this.nav.goToSignup();
  }
  goHome(){
  	this.nav.goToHome();
  }
}
