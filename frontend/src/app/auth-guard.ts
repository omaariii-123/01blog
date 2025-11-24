import { CanActivateFn } from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from './services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
	let auth = inject(AuthService);
	if (auth.state() == null) {
		return false;
	}
	return true;
};
