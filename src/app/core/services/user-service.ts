import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { UserLogin } from '../models/classes/User.Model';
import { environment } from '../../../environments/environment';
import { GlobalConstant } from '../constant/Constant';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  http = inject(HttpClient);
  apiUrl: string =  environment.API_URL;


  login(obj: UserLogin) {
    return this.http.post(this.apiUrl + GlobalConstant.API_ENDPOINTS.LOGIN,obj)
  }

  getUserById(id: number) {
    return this.http.get(`${this.apiUrl}${GlobalConstant.API_ENDPOINTS.GET_USER_BY_ID} ${id}`)
  }

  
}
