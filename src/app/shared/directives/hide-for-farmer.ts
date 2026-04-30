import { Directive, ElementRef, inject } from '@angular/core';
import { UserService } from '../../core/services/user-service';

@Directive({
  selector: '[hideForFarmer]',
})
export class HideForFarmer {

  userService  = inject(UserService);
  constructor(private eletRef: ElementRef) { 
    if(this.userService.loggedInUser.roleId ==2) {
      this.eletRef.nativeElement.style.display = 'none';
    } 
  }
}
