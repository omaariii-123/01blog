import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class ProfileComponent {
  private fb = inject(FormBuilder);
  auth = inject(AuthService);

  // State signal to toggle between View and Edit modes
  isEditing = signal(false);

  // Initialize form with current user data
  profileForm = this.fb.group({
    name: [this.auth.user()?.name || '', [Validators.required, Validators.minLength(2)]],
    email: [{ value: this.auth.user()?.email || '', disabled: true }], // Email usually shouldn't be editable directly
    bio: ['Software Engineer & Content Creator. Loves Angular and Coffee.', [Validators.maxLength(160)]],
    location: ['New York, USA']
  });

  get userInitials(): string {
    const name = this.auth.user()?.name || 'U';
    return name.substring(0, 2).toUpperCase();
  }

  toggleEdit() {
    this.isEditing.update(val => !val);
    if (!this.isEditing()) {
      // Reset form if cancelled
      this.profileForm.patchValue({
        name: this.auth.user()?.name
      });
    }
  }

  saveProfile() {
    if (this.profileForm.valid) {
      console.log('Saving profile...', this.profileForm.getRawValue());
      // TODO: Call this.auth.updateProfile(this.profileForm.value)
      this.isEditing.set(false);
    }
  }
}
