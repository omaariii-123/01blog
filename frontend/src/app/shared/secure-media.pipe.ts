import { Pipe, PipeTransform, inject } from '@angular/core';
import { AuthService } from '../auth.service';

@Pipe({
  name: 'secureMedia',
  standalone: true
})
export class SecureMediaPipe implements PipeTransform {
  private authService = inject(AuthService);

  transform(filename: string | undefined | null): string {
    if (!filename) return '';
    
    const baseUrl = 'http://localhost:8080/uploads/';
    const token = this.authService.getToken();
    
    return `${baseUrl}${filename}?token=${token}`;
  }
}