import { CanActivateFn } from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from './auth.service';

export const loginGuard: CanActivateFn = (route, state) => {
  	let auth = inject(AuthService);
	console.log(auth.state())
	if (auth.state() == null) {
		return true;
	}
	return false;
};
