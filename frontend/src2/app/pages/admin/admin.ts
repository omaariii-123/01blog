import { Component } from '@angular/core';
import { MATERIAL_MODULES } from '../../shared/material';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [...MATERIAL_MODULES],
  template: 'admin.html' , 
  styles: ['admin.css'],
  
})
export class AdminComponent {
  displayedColumns = ['id', 'user', 'reason', 'actions'];
  reports = [
    { id: 101, user: 'SpamBot99', reason: 'Spam Links' },
    { id: 102, user: 'AngryUser', reason: 'Harassment' },
    { id: 103, user: 'FakeAcct', reason: 'Impersonation' }
  ];
}
