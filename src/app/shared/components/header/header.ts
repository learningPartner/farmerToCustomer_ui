import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { finalize } from 'rxjs';
import { UserModel } from '../../../core/models/classes/User.Model';
import { UserService } from '../../../core/services/user-service';
import { OrderService } from '../../../core/services/order-service';
import { ICartItemView, ICartModel } from '../../../core/models/interfaces/product.interface';
@Component({selector:'app-header', imports:[RouterLink, RouterLinkActive, RouterModule], templateUrl:'./header.html', styleUrl:'./header.css'})
export class Header implements OnInit {
 router=inject(Router); destroyRef=inject(DestroyRef); userService=inject(UserService); orderSrv=inject(OrderService);
 menuOpen=false; loggedUserData=new UserModel(); cartItems=signal<ICartItemView[]>([]); isCartPopupOpen=false; cartBusy=signal(false);
 private cartRequest=0;
 constructor(){
  this.readLoggedData();
  this.router.events.pipe(takeUntilDestroyed()).subscribe(event=>{if(event instanceof NavigationEnd){this.menuOpen=false;this.isCartPopupOpen=false;}});
  this.userService.onLogin$.pipe(takeUntilDestroyed()).subscribe(()=>{this.readLoggedData();this.getCartData();});
  this.orderSrv.addtoCart$.pipe(takeUntilDestroyed()).subscribe(()=>this.getCartData());
 }
 ngOnInit(){this.getCartData();}
 toggleCartPopup(){this.isCartPopupOpen=!this.isCartPopupOpen;}
 getCartData(){
  const request=++this.cartRequest;
  if(!this.loggedUserData.userId){this.cartItems.set([]);return;}
  this.orderSrv.getCartItemsByCustId(this.loggedUserData.userId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
   next:res=>{if(request===this.cartRequest)this.cartItems.set(res.data??[]);},error:()=>{}
  });
 }
 onRemove(id:number){
  if(this.cartBusy()||!confirm('Remove this product from your cart?'))return;
  this.cartBusy.set(true);
  this.orderSrv.onRmoveCart(id).pipe(finalize(()=>this.cartBusy.set(false))).subscribe({next:()=>this.orderSrv.addtoCart$.next(true),error:()=>{}});
 }
 changeQuantity(item:ICartItemView,operation:string){
  if(this.cartBusy()||(operation==='minus'&&item.quantity<=1))return;
  const payload:ICartModel={addedAt:item.addedAt,cartId:item.cartId,customerId:item.customerId,farmerProductId:item.farmerProductId,quantity:operation==='plus'?item.quantity+1:item.quantity-1};
  this.cartBusy.set(true);
  this.orderSrv.onUpdateCart(payload).subscribe({next:()=>{
   // Keep the displayed quantity current before allowing another click.
   this.cartItems.update(items=>items.map(row=>row.cartId===item.cartId?{...row,quantity:payload.quantity}:row));
   this.cartBusy.set(false);this.orderSrv.addtoCart$.next(true);
  },error:()=>this.cartBusy.set(false)});
 }
 readLoggedData(){this.userService.getLoggedUser();this.loggedUserData=this.userService.loggedInUser;}
 onLogOff(){this.userService.logout();this.cartItems.set([]);this.isCartPopupOpen=false;this.router.navigateByUrl('/home');}
}
