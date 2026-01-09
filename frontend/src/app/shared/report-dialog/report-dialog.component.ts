import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-report-dialog',
    standalone: true,
    imports: [
        CommonModule,
        MatDialogModule,
        MatButtonModule,
        MatRadioModule,
        MatInputModule,
        MatFormFieldModule,
        FormsModule
    ],
    template: `
    <h2 mat-dialog-title>Report Content</h2>
    <mat-dialog-content>
      <p>Why are you reporting this?</p>
      <mat-radio-group [(ngModel)]="reason" class="radio-group">
        <mat-radio-button value="Spam">Spam</mat-radio-button>
        <mat-radio-button value="Harassment">Harassment</mat-radio-button>
        <mat-radio-button value="Inappropriate Media">Inappropriate Media</mat-radio-button>
        <mat-radio-button value="Other">Other</mat-radio-button>
      </mat-radio-group>

      <mat-form-field appearance="fill" class="full-width" *ngIf="reason === 'Other'">
        <mat-label>Additional Details</mat-label>
        <textarea matInput [(ngModel)]="details" rows="3"></textarea>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-flat-button color="warn" [mat-dialog-close]="getFullReason()" [disabled]="!reason">Submit Report</button>
    </mat-dialog-actions>
  `,
    styles: [`
    .radio-group {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 20px;
    }
    .full-width {
      width: 100%;
    }
  `]
})
export class ReportDialogComponent {
    reason: string = '';
    details: string = '';

    constructor(
        public dialogRef: MatDialogRef<ReportDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

    getFullReason(): string {
        if (this.reason === 'Other' && this.details) {
            return `Other: ${this.details}`;
        }
        return this.reason;
    }
}
