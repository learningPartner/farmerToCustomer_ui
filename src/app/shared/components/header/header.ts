import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { GlobalConstant } from '../../../core/constant/Constant';
import { UserModel } from '../../../core/models/classes/User.Model';
import { UserService } from '../../../core/services/user-service';
import { OrderService } from '../../../core/services/order-service';
import { ApiResponseModel } from '../../../core/models/interfaces/api-response.Model';
import { ICartItemView } from '../../../core/models/interfaces/product.interface';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {

  loggedUserData: UserModel = new UserModel();
  userService = inject(UserService);
  orderSrv = inject(OrderService);
  cartItems =  signal<ICartItemView[]>([]); 
  isCartPopupOpen: boolean = false;

  constructor() {
    this.readLoggedData();
    this.userService.onLogin$.subscribe({
      next:()=>{
     
       this.readLoggedData()
      }
    })
    
  }

  ngOnInit(): void {
    this.getCartData();
    this.orderSrv.addtoCart$.subscribe((res:boolean)=>{
      debugger;
      this.getCartData();
    })
  }

  toggleCartPopup() {
    this.isCartPopupOpen = !this.isCartPopupOpen;
  }

  getCartData() {
    this.orderSrv.getCartItemsByCustId(this.loggedUserData.userId).subscribe({
      next:(res:ApiResponseModel)=>{
        this.cartItems.set(res.data);
      }
    })
  }

  onRemove(id: number) {
    const isDlete = confirm("Are you Sure want Remove product");
    if(isDlete) {
      this.orderSrv.onRmoveCart(id).subscribe({
      next:(res:ApiResponseModel)=>{
        this.getCartData();
      }
    })
    } 
    
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
