import { Component, inject, signal } from '@angular/core';
import { UserLogin, UserModel } from '../../core/models/classes/User.Model';
import { UserService } from '../../core/services/user-service';
import { getSumOfTwoNum } from '../../core/helper/Utility';
import { Roles } from '../../core/enums/Role.enum';
import { CommonImports } from '../../core/constant/CommonImports';
import { ApiResponseModel, IRole, LoginResponse } from '../../core/models/interfaces/api-response.Model';
import { Router } from '@angular/router';
import { GlobalConstant } from '../../core/constant/Constant';
import { NgClass } from '@angular/common';
import {   MasterService } from '../../core/services/master';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [CommonImports.FORM_IMPORTS, NgClass],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  userSrv = inject(UserService);
  router = inject(Router);
  masterSrv = inject(MasterService);
  formBuilder = inject(FormBuilder);

  loginObj: UserLogin = new UserLogin();
  registerForm!: FormGroup;
  isLoginFormVisiable = signal<boolean>(true);
  roleList = signal<IRole[]>([])
  isRegistering = signal<boolean>(false);

  constructor() {
    this.initializeRegisterForm();
  }

  initializeRegisterForm() {
    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      roleId: ['', [Validators.required]],
      address: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup): {[key: string]: any} | null {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ 'passwordMismatch': true });
      return { 'passwordMismatch': true };
    }
    return null;
  }

  onToggleForm(isShow: boolean) {
    this.isLoginFormVisiable.set(isShow);
    if (isShow == false) {
      this.getAllRoles();
    }
  }

  getAllRoles() {
    if (this.roleList().length == 0) {
      this.masterSrv.getAllRoles().subscribe({
        next: (res: ApiResponseModel) => {
          const allowedRoles = res.data.filter((m: IRole) => m.roleName != 'SUPER_ADMIN')
          this.roleList.set(allowedRoles)
        }
      })
    }

  }

  onLogin() {
    
    this.userSrv.login(this.loginObj).subscribe({
      next: (res: LoginResponse) => {
        localStorage.setItem(GlobalConstant.LOCAL_LOGIN_KEY, JSON.stringify(res.data));
        localStorage.setItem(GlobalConstant.TOKEN_KEY,res.token)
        this.userSrv.getLoggedUser();
        this.userSrv.onLogin$.next(true);
        this.router.navigateByUrl("/home");
      },
      error: (error) => {
        alert("Wrong Credentials")
      }
    })
  }

  onRegister() {
    
    if (this.registerForm.invalid) {
      alert('Please fill all required fields correctly');
      return;
    }

    this.isRegistering.set(true);
    const formValue = this.registerForm.value;
    
    const userObj = new UserModel();
    userObj.name = formValue.name;
    userObj.email = formValue.email;
    userObj.password = formValue.password;
    userObj.roleId = formValue.roleId;
    userObj.phone = formValue.phone;
    userObj.address = formValue.address;

    this.userSrv.registerUser(userObj).subscribe({
      next: (res: any) => {
        this.isRegistering.set(false);
        alert('Registration successful! Please login with your credentials.');
        this.registerForm.reset();
        this.onToggleForm(true);
      },
      error: (error) => {
        this.isRegistering.set(false);
        alert('Registration failed. Please try again.');
        console.error('Registration error:', error);
      }
    })
  }

}
