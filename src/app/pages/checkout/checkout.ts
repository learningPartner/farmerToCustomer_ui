import { Component, inject, OnInit, signal } from '@angular/core';
import { OrderService } from '../../core/services/order-service';
import { UserService } from '../../core/services/user-service';
import { ApiResponseModel } from '../../core/models/interfaces/api-response.Model';
import { ICartItemView } from '../../core/models/interfaces/product.interface';
import { OrderModel } from '../../core/models/classes/ProductMaster.model';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  imports: [FormsModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout implements OnInit{

  orderSrv = inject(OrderService);
  userSrv = inject(UserService);
  router = inject(Router);
  cartData = signal<ICartItemView[]>([]);
  orderObj: OrderModel = new OrderModel();
  total = signal<number>(0);
  //total = 0;

  ngOnInit(): void {
    this.getCartsItems();
    this.orderObj.customerId =  this.userSrv.loggedInUser.userId;
  }

  getCartsItems() {
    this.orderSrv.getCartItemsByCustId(this.userSrv.loggedInUser.userId).subscribe({
      next:(res:ApiResponseModel)=>{
        this.cartData.set(res.data);
        const total =  this.cartData().reduce((acc ,data)=>{
          return acc +( data.pricePerKg * data.quantity)
        },0)
        debugger;
        setTimeout(() => {
          this.total.set(total)
           debugger;
        }, 3000);
        //this.total.set(total)
      }
    })
  }

  onSaveOrder() {
    this.orderSrv.onSaveOrder(this.orderObj).subscribe({
      next:(res:ApiResponseModel)=>{
        alert("Order Placed Succes");
        this.router.navigateByUrl('/home');
        this.orderSrv.addtoCart$.next(true)
      }
    })
  }
}
