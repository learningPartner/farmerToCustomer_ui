import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GlobalConstant } from '../../../core/constant/Constant';
import { UserModel } from '../../../core/models/classes/User.Model';
import { UserService } from '../../../core/services/user-service';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {

  loggedUserData: UserModel = new UserModel();
  userService = inject(UserService);

  constructor() {
    this.readLoggedData();
    this.userService.onLogin$.subscribe({
      next:()=>{
     
       this.readLoggedData()
      }
    })
    
  }

  readLoggedData() {
    const localData=  localStorage.getItem(GlobalConstant.LOCAL_LOGIN_KEY);
    if(localData != null) {
      this.loggedUserData = JSON.parse(localData)
    }
  }
  onLogOff() {
    localStorage.removeItem(GlobalConstant.LOCAL_LOGIN_KEY);
    this.loggedUserData = new UserModel();
  }
}
