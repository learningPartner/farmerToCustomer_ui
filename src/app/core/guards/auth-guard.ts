import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { UserService } from '../services/user-service';
export const authGuard: CanActivateFn = (route, state) => {
 const router = inject(Router), users = inject(UserService);
 users.getLoggedUser();
 if (!users.loggedInUser?.userId) return router.createUrlTree(['/login'], {queryParams:{returnUrl:state.url}});
 const roles = route.data['roles'] as number[] | undefined;
 return !roles || roles.includes(users.loggedInUser.roleId) ? true : router.createUrlTree(['/home']);
};
