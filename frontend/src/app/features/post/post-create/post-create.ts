import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// Updated Interface to match your Form
export interface Post {
  id: string;
  userId: string;
  title: string;       // Added based on your HTML
  description: string;
}

@Component({
  selector: 'app-post-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './post-create.html',
  styleUrl: './post-create.css'
})
export class PostCreateComponent {
  
  // 1. Modern Dependency Injection
  private fb = inject(FormBuilder);
  private router = inject(Router);
  // private auth = inject(AuthService); // You would inject your Auth service here to get the userId

  // 2. Form Definition
  postForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(5)]],
    description: ['', [Validators.required, Validators.minLength(10)]]
  });

  // 3. Submit Logic
  onSubmit(): void {
    if (this.postForm.valid) {
      const formValues = this.postForm.value;

      // Create the Post Object
      const newPost: Post = {
        id: crypto.randomUUID(), // Modern way to generate IDs in browser
        userId: 'current-user-id', // Replace with this.auth.user().id
        title: formValues.title || '',
        description: formValues.description || ''
      };

      console.log('Creating Post:', newPost);
      
      // TODO: Call your service here, e.g., this.postService.create(newPost).subscribe(...)
      
      // Navigate back to home or dashboard
      this.router.navigate(['/']);
    } else {
      // Optional: Mark all as touched to trigger error styles if user clicks submit early
      this.postForm.markAllAsTouched();
    }
  }

  // 4. Cancel Logic
  onCancel(): void {
    this.router.navigate(['/']);
  }
}
