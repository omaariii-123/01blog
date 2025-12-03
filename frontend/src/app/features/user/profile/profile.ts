import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { PostService } from '../../post/services/post.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class ProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  auth = inject(AuthService);
  postService = inject(PostService);

  // State signal to toggle between View and Edit modes
  isEditing = signal(false);

  // Computed signal for user's posts
  userPosts = computed(() => {
    const userId = this.auth.user()?.id;
    if (!userId) return [];
    return this.postService.posts().filter(p => p.userId === userId);
  });

  // Initialize form with current user data
  profileForm = this.fb.group({
    name: [this.auth.user()?.name || '', [Validators.required, Validators.minLength(2)]],
    email: [{ value: this.auth.user()?.email || '', disabled: true }],
    bio: ['Software Engineer & Content Creator. Loves Angular and Coffee.', [Validators.maxLength(160)]],
    location: ['New York, USA']
  });

  ngOnInit() {
    // Ensure posts are loaded
    this.postService.getPosts().subscribe();
  }

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
      // For now, just update the local signal to reflect changes in UI if name changed
      const updatedName = this.profileForm.get('name')?.value;
      if (updatedName) {
        this.auth.user.update(u => u ? { ...u, name: updatedName } : null);
      }
      this.isEditing.set(false);
    }
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
