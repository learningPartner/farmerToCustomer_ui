import { Component, inject, OnInit, signal } from '@angular/core';
import { UserModel, UserModelList } from '../../core/models/classes/User.Model';
import { UserService } from '../../core/services/user-service';
import { map, Observable } from 'rxjs';
import { ApiResponseModel } from '../../core/models/interfaces/api-response.Model';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-farmers',
  imports: [AsyncPipe],
  templateUrl: './farmers.html',
  styleUrl: './farmers.css',
})
export class Farmers{

  userService = inject(UserService)

  farmersList$ : Observable<UserModel[]> = this.userService.getAllUsers()
                 .pipe(map((res:ApiResponseModel)=>
                  res.data.filter((user:UserModel)=> user.roleId == 2)));
 
  applyFilter(){
    debugger;
    
  }               

}
