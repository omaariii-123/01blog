import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

export const ErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar);
  const authService = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Trying to grab the custom message from Spring Boot's JSON response,
      const backendMessage = error.error?.message || '';
      let displayMessage = 'An unexpected error occurred';

      switch (error.status) {
        case 0:
          displayMessage = 'Cannot connect to the server. Please check your internet connection.';
          break;

        case 400:
          displayMessage = backendMessage || 'Bad Request: Please check the data you entered.';
          break;

        case 401:
          displayMessage =
            backendMessage || 'Unauthorized: Invalid credentials or your session expired.';
          authService.logout();
          router.navigate(['/login']);
          break;

        case 403:
          displayMessage = backendMessage || 'Forbidden: You do not have permission to do this.';
          router.navigate(['/']);
          break;

        case 404:
          displayMessage = backendMessage || 'Not Found: The requested resource does not exist.';
          break;

        case 409:
          displayMessage = backendMessage || 'Conflict: This action conflicts with existing data.';
          break;

        case 422:
          displayMessage = backendMessage || 'Validation Error: The data provided is invalid.';
          break;

        case 500:
          displayMessage = 'Internal Server Error: Something went wrong on our end.';
          break;

        case 503:
          displayMessage = 'Service Unavailable: The server is currently down for maintenance.';
          break;

        default:
          displayMessage = backendMessage || `Error ${error.status}: Something went wrong.`;
          break;
      }

      // Show the snackbar with the error message
      snackBar.open(displayMessage, 'Close', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: ['error-snackbar'],
      });

      // Pass the error along to the component in case it needs to do something (like resetting a form)
      return throwError(() => error);
    })
  );
};
