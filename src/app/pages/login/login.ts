import { Component, inject } from '@angular/core';
import { UserLogin } from '../../core/models/classes/User.Model';
import { UserService } from '../../core/services/user-service';
import { getSumOfTwoNum } from '../../core/helper/Utility';
import { Roles } from '../../core/enums/Role.enum'; 
import { CommonImports } from '../../core/constant/CommonImports';

@Component({
  selector: 'app-login',
  imports: [CommonImports.FORM_IMPORTS],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  
  userSrv=  inject(UserService)

  loginObj: UserLogin = {
    userName:'',
    password: '',
    role:0
  }

  constructor() {
    const getSum =  getSumOfTwoNum(23,45);
  }
  onLogin() {
    const loginDat = {};
    this.loginObj.role =  Roles.Farmer;
    this.userSrv.login(this.loginObj).subscribe({

    })
  }

}
