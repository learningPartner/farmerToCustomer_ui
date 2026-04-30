import { CanActivateFn, Router } from '@angular/router';
import { GlobalConstant } from '../constant/Constant';
import { inject } from '@angular/core';
import { UserService } from '../services/user-service';

//upto 15v this service 
export const authGuard: CanActivateFn = (route, state) => {
  
  const router = inject(Router);
  const userService = inject(UserService);
   
  if(userService.loggedInUser == undefined) {
    router.navigateByUrl("/login");
    return false;
  } else {
    return true;
  }
  
};
