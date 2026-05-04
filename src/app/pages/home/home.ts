
import { Component, ElementRef, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { CommonImports } from '../../core/constant/CommonImports';
import { ProductService } from '../../core/services/product';
import { MasterService } from '../../core/services/master';
import { Category } from '../../core/models/classes/Master.model';
import { ApiResponseModel } from '../../core/models/interfaces/api-response.Model';
import { interval, map, Observable, Subscription } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { ProductMasterService } from '../../core/services/product-master';
import { ICartModel, IProductList } from '../../core/models/interfaces/product.interface';
import { NgOptimizedImage } from '@angular/common';
import { UserService } from '../../core/services/user-service';
import { UserModel, UserModelList } from '../../core/models/classes/User.Model';
import { OrderService } from '../../core/services/order-service';
@Component({
  selector: 'app-home',
  imports: [CommonImports.FORM_IMPORTS,AsyncPipe,NgOptimizedImage],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit, OnDestroy {

  masterSrv = inject(MasterService)  
  productServ = inject(ProductService) ;
  orderSrv = inject(OrderService) ;
  userSrv = inject(UserService) ;
  productList = signal<IProductList[]>([]);
  selectedCategory = signal<string>("All");
  @ViewChild('cartModel') cartModelRef!: ElementRef;

  categorListObs$: Observable<Category[]> = new Observable<Category[]>;

  timer$ = interval(2000);
  farmerList: UserModelList[] = [];
  selectedProductData!: IProductList;
  cartQuantity: number = 0;

  cartObj: ICartModel = {
    cartId: 0,
    addedAt: new Date(),
    customerId: 0,
    farmerProductId:0,
    quantity: 0
  }

  ngOnInit(): void {
    this.categorListObs$ = this.masterSrv.getAllCategory().pipe(
      map((res:ApiResponseModel)=> res.data)
    );
    this.getAllProduct();
    this.getAllFarmers();
  }

  getProductByCateId(cat:Category) {
    this.selectedCategory.set(cat.name);
    this.productServ.getAllFarmerProductsByCatId(cat.categoryId).subscribe({
      next:(res:ApiResponseModel)=>{
        this.productList.set(res.data)
      }
    })
  }

  openCartModel(item: IProductList) {
    if(this.cartModelRef) {
       debugger;
      this.selectedProductData =  item;
      this.cartObj.farmerProductId = item.farmerProductId;
      this.cartModelRef.nativeElement.style.display = 'block'
    }
  }

   closeCartModel() {
    if(this.cartModelRef) {
      this.cartModelRef.nativeElement.style.display = 'none'
    }
  }

  onAddtoCart() {
    debugger;
    this.cartObj.customerId = this.userSrv.loggedInUser.userId;
    this.cartObj.quantity = this.cartQuantity;

    this.orderSrv.onSaveAddToCart(this.cartObj).subscribe({
      next:(res:ApiResponseModel)=>{
        alert("Product Added to Cart Success");
        this.closeCartModel();
        debugger;
        this.orderSrv.addtoCart$.next(true);
      }
    })
  }

  getAllProduct() {
     this.productServ.getAllProducts().subscribe({
      next:(res:ApiResponseModel)=>{
        this.productList.set(res.data)
      }
    })
  }
  
  getAllFarmers() {
    this.userSrv.getAllUsers().subscribe({
      next:(res:ApiResponseModel)=>{
        this.farmerList =  res.data.filter((m:UserModelList)=> m.roleId ==2)
      }
    })
  }

  ngOnDestroy(): void {
     
  }
}
