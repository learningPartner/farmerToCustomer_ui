import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { UserLogin, UserModel, UserModelList } from '../models/classes/User.Model';
import { environment } from '../../../environments/environment';
import { GlobalConstant } from '../constant/Constant';
import { Observable, Subject } from 'rxjs';
import { ApiResponseModel, LoginResponse } from '../models/interfaces/api-response.Model';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  http = inject(HttpClient);
  apiUrl: string =  environment.API_URL;
  
  onLogin$ : Subject<boolean> = new Subject<boolean>();
  loggedInUser!: UserModel;

  constructor() {
    
    this.getLoggedUser();
  }

  getLoggedUser() {
    this.loggedInUser = new UserModel();
    try {
      const data = JSON.parse(localStorage.getItem(GlobalConstant.LOCAL_LOGIN_KEY) || 'null');
      if (data?.userId > 0) this.loggedInUser = data;
    } catch { localStorage.removeItem(GlobalConstant.LOCAL_LOGIN_KEY); }
  }

  logout() {
    localStorage.removeItem(GlobalConstant.LOCAL_LOGIN_KEY);
    localStorage.removeItem(GlobalConstant.TOKEN_KEY);
    this.loggedInUser = new UserModel();
    this.onLogin$.next(false);
  }

  login(obj: UserLogin) :Observable<LoginResponse> {
    
    return this.http.post<LoginResponse>(this.apiUrl + GlobalConstant.API_ENDPOINTS.LOGIN,obj)
  }

  registerUser(userObj: UserModel): Observable<any> {
    return this.http.post<any>(this.apiUrl + GlobalConstant.API_ENDPOINTS.CREATE_USER, userObj);
  }

  getUserById(id: number) {
    return this.http.get(`${this.apiUrl}${GlobalConstant.API_ENDPOINTS.GET_USER_BY_ID}${id}`)
  }

   getAllUsers() :Observable<ApiResponseModel>{
    return this.http.get<ApiResponseModel>(`${this.apiUrl}${GlobalConstant.API_ENDPOINTS.GET_ALL_USERS}`)
  }

  
}
