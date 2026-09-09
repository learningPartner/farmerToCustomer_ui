import { Component, computed, inject, OnInit, signal, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { OrderService } from '../../core/services/order-service';
import { UserService } from '../../core/services/user-service';
import { ICartItemView } from '../../core/models/interfaces/product.interface';
import { OrderModel } from '../../core/models/classes/ProductMaster.model';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
@Component({selector:'app-checkout', imports:[FormsModule, CurrencyPipe, RouterLink], templateUrl:'./checkout.html', styleUrl:'./checkout.css'})
export class Checkout implements OnInit {
 orderSrv=inject(OrderService); userSrv=inject(UserService); router=inject(Router); messages=inject(MessageService);
 destroyRef=inject(DestroyRef);
 cartData=signal<ICartItemView[]>([]); orderObj=new OrderModel(); loading=signal(true); saving=signal(false); error=signal('');
 total=computed(()=>this.cartData().reduce((sum,item)=>sum+item.pricePerKg*item.quantity,0));
 farmerCount=computed(()=>new Set(this.cartData().map(item=>item.farmerId)).size);
 ngOnInit(){this.orderObj.customerId=this.userSrv.loggedInUser.userId;this.getCartsItems();
 this.orderSrv.addtoCart$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(()=>this.getCartsItems());}
 getCartsItems(){this.loading.set(true);this.error.set('');this.orderSrv.getCartItemsByCustId(this.orderObj.customerId).subscribe({
 next:res=>{this.cartData.set(res.data??[]);this.loading.set(false);},
 error:()=>{this.error.set('Your cart could not be loaded. Please retry.');this.loading.set(false);}});}
 onSaveOrder(){
 if(this.saving()||this.loading()||this.error()||!this.cartData().length)return;
 if(!this.orderObj.city.trim()||!this.orderObj.state.trim()||!this.orderObj.addressLine1.trim()||!/^[1-9][0-9]{5}$/.test(this.orderObj.pincode)){
 this.messages.add({severity:'warn',summary:'Delivery address required',detail:'Enter your city, state, street address and a valid six-digit pincode.'});return;}
 this.saving.set(true);
 this.orderSrv.onSaveOrder(this.orderObj).subscribe({next:()=>{
 this.messages.add({severity:'success',summary:'Order placed',detail:'You can view your order in My Orders.'});
 this.router.navigateByUrl('/orders');this.orderSrv.addtoCart$.next(true);
 },error:()=>this.saving.set(false)});
 }
}
