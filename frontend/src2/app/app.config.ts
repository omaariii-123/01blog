import { ApplicationConfig, provideBrowserGlobalErrorListeners, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { AuthService } from './core/auth/auth.service';
import { firstValueFrom } from 'rxjs';

function initializeApp(authService: AuthService) {
	return () => firstValueFrom(authService.checkStatus());
}

export const appConfig: ApplicationConfig = {
	providers: [
		provideBrowserGlobalErrorListeners(),
		provideAnimationsAsync(),
		provideRouter(routes),
		provideHttpClient(),
		AuthService,
		{
			provide: APP_INITIALIZER,
			useFactory: initializeApp,
			deps: [AuthService],
			multi: true
		}
	]
};
