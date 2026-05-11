import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { GlobalConstant } from '../constant/Constant';
import { map, Observable } from 'rxjs';
import { ApiResponseModel } from '../models/interfaces/api-response.Model';
import { Category, Role } from '../models/classes/Master.model';

@Injectable({
  providedIn: 'root',
})
export class MasterService {

  http = inject(HttpClient);

  getAllRoles(): Observable<ApiResponseModel> {
    
    return this.http.get<ApiResponseModel>(environment.API_URL + GlobalConstant.API_ENDPOINTS.GET_ALL_ROLES)
  }

  createRole(roleObj: Role): Observable<ApiResponseModel> {
    return this.http.post<ApiResponseModel>(environment.API_URL + GlobalConstant.API_ENDPOINTS.CREATE_ROLE,roleObj)
  }
   updateRole(roleObj: Role): Observable<ApiResponseModel> {
    return this.http.put<ApiResponseModel>(environment.API_URL + GlobalConstant.API_ENDPOINTS.UPDATE_ROLE + roleObj.roleId,roleObj)
  }

  createCategory(cateObj: Category): Observable<ApiResponseModel> {
    return this.http.post<ApiResponseModel>(environment.API_URL + GlobalConstant.API_ENDPOINTS.CREATE_CATEGORY,cateObj)
  }

  updateCategory(cateObj: Category): Observable<ApiResponseModel> {
    return this.http.put<ApiResponseModel>(environment.API_URL + GlobalConstant.API_ENDPOINTS.UPDATE_CATEGORY + cateObj.categoryId,cateObj)
  }
  getAllCategory(): Observable<ApiResponseModel> {
    
    return this.http.get<ApiResponseModel>(environment.API_URL + GlobalConstant.API_ENDPOINTS.GET_CATEGORY)
  }

  getCategorys(): Observable<Category[]> { 
    return this.http.get<ApiResponseModel>(environment.API_URL + GlobalConstant.API_ENDPOINTS.GET_CATEGORY).pipe(
       map((res:ApiResponseModel) => res.data)
    );
  }
}
