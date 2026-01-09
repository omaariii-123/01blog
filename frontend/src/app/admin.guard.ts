import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

export const adminGuard = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isLoggedIn() && authService.isAdmin()) {
        return true;
    }

    // Redirect to home if logged in but not admin, or login if not logged in
    return router.parseUrl(authService.isLoggedIn() ? '/' : '/login');
};
