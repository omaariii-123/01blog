import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PostService } from '../services/post.service';
import { AuthService } from '../../../core/auth/auth.service';
import { Post } from '../post.model';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-post-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule],
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
    content: ['', [Validators.required, Validators.minLength(10)]]
  });

  onSubmit(): void {
    if (this.postForm.valid) {
      const formValues = this.postForm.value;

      // Backend handles ID generation and User assignment from Session
      // We just need to send title and content.
      // However, PostService expects 'Post'. We should verify PostService signature.
      // I'll create an object that satisfies the DTO expectation.
      // Ideally PostService should take a DTO.
      // Hack: Send object and cast to any or Post if we must.

      const newPost: any = {
        title: formValues.title,
        content: formValues.content,
        userId: this.authService.user()?.id,
	  };

      console.log('Creating Post:', newPost);

      this.postService.createPost(newPost).subscribe({
        next: (res) => {
			console.log(res);
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
