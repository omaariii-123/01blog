import { CanActivateFn } from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from '../auth/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
	let auth: AuthService = inject(AuthService);
	if (auth.state() == null) {
		return false;
	}
	return true;
};
