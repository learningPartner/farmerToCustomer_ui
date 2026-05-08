import { Component, inject, OnInit, signal } from '@angular/core';
import { UserLogin, UserModel } from '../../core/models/classes/User.Model';
import { UserService } from '../../core/services/user-service';
import { getSumOfTwoNum } from '../../core/helper/Utility';
import { Roles } from '../../core/enums/Role.enum';
import { CommonImports } from '../../core/constant/CommonImports';
import { ApiResponseModel, IRole, LoginResponse } from '../../core/models/interfaces/api-response.Model';
import { Router } from '@angular/router';
import { GlobalConstant } from '../../core/constant/Constant';
import { NgClass, TitleCasePipe } from '@angular/common';
import { MasterService } from '../../core/services/master';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-login',
  imports: [CommonImports.FORM_IMPORTS, NgClass, TitleCasePipe,DatePickerModule,],
  templateUrl: './login.html',
  styleUrl: './login.css' 
})
export class Login implements OnInit {

  userSrv = inject(UserService);
  router = inject(Router);
  masterSrv = inject(MasterService);
  formBuilder = inject(FormBuilder);
  toastService  = inject(MessageService);

  loginObj: UserLogin = new UserLogin();
  registerForm!: FormGroup;
  isLoginFormVisiable = signal<boolean>(true);
  roleList = signal<IRole[]>([])
  isRegistering = signal<boolean>(false);
  isApiInPgogress = signal<boolean>(false);
  currentDate = new Date();
  maxDate =new Date()

  constructor() {
    const today =  new Date();
    today.setDate(today.getDate() + 7);
    this.maxDate = today;
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




  ngOnInit(): void {
    this.getAllCategory();
  }

  setRole(roleid: number) {
    this.registerForm.controls['roleId'].setValue(roleid);
  }

  getAllCategory() {
    this.masterSrv.getAllCategory().subscribe({
      next: (res: ApiResponseModel) => {
        debugger;
      }
    })
  }
  passwordMatchValidator(form: FormGroup): { [key: string]: any } | null {
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
          const allowedRoles = res.data.filter((m: IRole) => m.roleName == 'FARMER' || m.roleName == 'CUSTOMER')
          this.roleList.set(allowedRoles)
        }
      })
    }

  }

  onLogin() {
    this.isApiInPgogress.set(true);
    this.userSrv.login(this.loginObj).subscribe({
      next: (res: LoginResponse) => {
        localStorage.setItem(GlobalConstant.LOCAL_LOGIN_KEY, JSON.stringify(res.data));
        localStorage.setItem(GlobalConstant.TOKEN_KEY, res.token)
        this.userSrv.getLoggedUser();
        this.userSrv.onLogin$.next(true);
        this.router.navigateByUrl("/home");
        this.isApiInPgogress.set(false)
         this.toastService.add({ severity: 'info', summary: 'Success', detail: 'Welcome User' })
      },
      error: (error) => {
        this.toastService.add({ severity: 'error', summary: 'Error', detail: 'Wrong Credentials' })
        //alert("Wrong Credentials")
        this.isApiInPgogress.set(false)
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
