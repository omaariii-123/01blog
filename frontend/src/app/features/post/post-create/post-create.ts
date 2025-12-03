import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PostService } from '../services/post.service';
import { AuthService } from '../../../core/auth/auth.service';
import { Post } from '../post.model';

@Component({
  selector: 'app-post-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './post-create.html',
  styleUrl: './post-create.css'
})
export class PostCreateComponent {

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private postService = inject(PostService);
  private authService = inject(AuthService);

  postForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(5)]],
    description: ['', [Validators.required, Validators.minLength(10)]]
  });

  onSubmit(): void {
    if (this.postForm.valid) {
      const formValues = this.postForm.value;
      const currentUser = this.authService.user();

      if (!currentUser || !currentUser.id) {
        console.error('User not logged in or missing ID');
        return;
      }

      const newPost: Post = {
        id: crypto.randomUUID(),
        userId: currentUser.id as string,
        title: formValues.title || '',
        description: formValues.description || ''
      };

      console.log('Creating Post:', newPost);

      this.postService.createPost(newPost).subscribe({
        next: () => {
          this.router.navigate(['/dash']);
        },
        error: (err) => {
          console.error('Error creating post:', err);
        }
      });

    } else {
      this.postForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.router.navigate(['/dash']);
  }
}
