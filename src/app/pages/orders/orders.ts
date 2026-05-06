import { Component, inject, OnInit } from '@angular/core';
import { OrderService } from '../../core/services/order-service';
import { Observable } from 'rxjs';
import { IOrderList } from '../../core/models/interfaces/product.interface';
import { UserService } from '../../core/services/user-service';
import { AsyncPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-orders',
  imports: [AsyncPipe,DatePipe],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class Orders implements OnInit {

  orderService = inject(OrderService);
  userService = inject(UserService);

  orderList$ : Observable<IOrderList[]> = new Observable<IOrderList[]>;

  ngOnInit(): void {
    if(this.userService.loggedInUser.roleId ==  2) {
      this.orderList$ =  this.orderService.getOrdersByFarmerId(this.userService.loggedInUser.userId)
    } else {
      this.orderList$ =  this.orderService.getOrdersByCustomerId(this.userService.loggedInUser.userId)
    }
  }
 
}
