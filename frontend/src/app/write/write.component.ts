import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { PostService } from '../post.service';

@Component({
    selector: 'app-write',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule
    ],
    template: `
    <div class="write-container">
      <mat-card class="write-card">
        <mat-card-header>
          <mat-card-title>Create a New Block Post</mat-card-title>
        </mat-card-header>
        
        <mat-card-content>
          <form class="write-form">
            <mat-form-field appearance="outline" class="title-field">
              <mat-label>Post Title (optional)</mat-label>
              <input matInput [(ngModel)]="title" name="title" placeholder="Give your post a clear title">
            </mat-form-field>

            <mat-form-field appearance="outline" class="content-field">
              <mat-label>What are you learning today?</mat-label>
              <textarea matInput [(ngModel)]="content" name="content" rows="12" placeholder="Share your knowledge... Markdown is supported."></textarea>
            </mat-form-field>

            <div class="media-upload-area" (click)="fileInput.click()" (drop)="onDrop($event)" (dragover)="onDragOver($event)">
               <input type="file" #fileInput (change)="onFileSelected($event)" style="display: none" accept="image/*,video/*">
               <div class="upload-placeholder" *ngIf="!selectedFile">
                  <mat-icon>cloud_upload</mat-icon>
                  <p>Drag and drop media here, or click to select</p>
               </div>
               <div class="file-preview" *ngIf="selectedFile">
                  <mat-icon>check_circle</mat-icon>
                  <p>{{ selectedFile.name }}</p>
                  <button mat-icon-button (click)="removeFile($event)"><mat-icon>close</mat-icon></button>
               </div>
            </div>
          </form>
        </mat-card-content>

        <mat-card-actions align="end">
          <button mat-button (click)="cancel()">Cancel</button>
          <button mat-raised-button color="primary" (click)="publish()" [disabled]="!content">Publish to Block</button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
    styles: [`
    .write-container {
      max-width: 800px;
      margin: 40px auto;
      padding: 0 20px;
    }

    .write-card {
      padding: 24px;
    }

    .write-form {
      display: flex;
      flex-direction: column;
      gap: 24px;
      margin-top: 24px;
    }

    .full-width {
      width: 100%;
    }

    .media-upload-area {
      border: 2px dashed #e0e0e0;
      border-radius: 8px;
      padding: 40px;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s;
      background: #fafafa;
    }

    .media-upload-area:hover {
      border-color: var(--primary-color);
      background: #f0f7ff;
    }

    .upload-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      color: var(--text-secondary);
    }

    .upload-placeholder mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
    }

    .file-preview {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
        color: var(--success-color);
    }
  `]
})
export class WriteComponent {
    title = '';
    content = '';
    selectedFile: File | null = null;

    private postService = inject(PostService);
    private router = inject(Router);

    onFileSelected(event: any) {
        const file = event.target.files[0];
        if (file) {
            this.selectedFile = file;
        }
    }

    onDragOver(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
    }

    onDrop(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
        if (event.dataTransfer?.files.length) {
            this.selectedFile = event.dataTransfer.files[0];
        }
    }

    removeFile(event: Event) {
        event.stopPropagation();
        this.selectedFile = null;
    }

    cancel() {
        this.router.navigate(['/']);
    }

    publish() {
        if (!this.content) return;

        // Note: API currently takes content string. Media handle would need multipart support or separate upload.
        // Assuming createPost just takes description for now based on previous code.
        // If backend supports title/media, we'd append them here. 
        // Implementing basic publish for now.

        this.postService.createPost(this.content).subscribe({
            next: () => {
                this.router.navigate(['/']);
            },
            error: (err) => {
                console.error('Failed to publish', err);
            }
        });
    }
}
