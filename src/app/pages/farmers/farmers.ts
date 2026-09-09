import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { UserModel } from '../../core/models/classes/User.Model';
import { UserService } from '../../core/services/user-service';
import { map, Observable } from 'rxjs';
import { ApiResponseModel } from '../../core/models/interfaces/api-response.Model';
import { AsyncPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-farmers',
  imports: [AsyncPipe, DatePipe],
  templateUrl: './farmers.html',
  styleUrl: './farmers.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Farmers{

  userService = inject(UserService)
  selectedFarmer = signal<UserModel | null>(null);

  farmersList$ : Observable<UserModel[]> = this.userService.getAllUsers()
                 .pipe(map((res:ApiResponseModel)=>
                  res.data.filter((user:UserModel)=> user.roleId == 2)));

  openFarmerModal(farmer: UserModel): void {
    this.selectedFarmer.set(farmer);
  }

  closeFarmerModal(): void {
    this.selectedFarmer.set(null);
  }
 
  applyFilter(){
    debugger;
    
  }               

}
