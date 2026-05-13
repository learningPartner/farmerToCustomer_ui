
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
import { Router } from '@angular/router';
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
  router = inject(Router);
  productList = signal<IProductList[]>([]);
  selectedCategory = signal<string>("All");
  @ViewChild('cartModel') cartModelRef!: ElementRef;

  categorListObs$: Observable<Category[]> = new Observable<Category[]>;
  searchText = '';
  selectedCategoryId = 0;

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
      map((res:ApiResponseModel)=> res.data ?? [])
    );
    this.getAllProduct();
    this.getAllFarmers();
  }

  getProductByCateId(cat:Category) {
    this.selectedCategory.set(cat.name);
    this.selectedCategoryId = cat.categoryId;
    this.productServ.getAllFarmerProductsByCatId(cat.categoryId).subscribe({
      next:(res:ApiResponseModel)=>{
        this.productList.set(res.data)
      }
    })
  }

  openCartModel(item: IProductList) {
    if (!this.isUserLoggedIn()) {
      alert('Please login to add products to your cart.');
      this.router.navigate(['/login']);
      return;
    }

    if(this.cartModelRef) {
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
    if (!this.isUserLoggedIn()) {
      alert('Please login to add products to your cart.');
      this.closeCartModel();
      this.router.navigate(['/login']);
      return;
    }

    this.cartObj.customerId = this.userSrv.loggedInUser.userId;
    this.cartObj.quantity = this.cartQuantity;

    this.orderSrv.onSaveAddToCart(this.cartObj).subscribe({
      next:(res:ApiResponseModel)=>{
        alert("Product Added to Cart Success");
        this.closeCartModel();
        this.orderSrv.addtoCart$.next(true);
      }
    })
  }

  getAllProduct() {
    this.selectedCategory.set('All');
    this.selectedCategoryId = 0;
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

  goToProducts() {
    this.router.navigate(['/products']);
  }

  onSearchProducts() {
    const queryParams: { productName?: string; categoryId?: number } = {};
    const productName = this.searchText.trim();

    if (productName) {
      queryParams.productName = productName;
    }

    if (this.selectedCategoryId > 0) {
      queryParams.categoryId = this.selectedCategoryId;
    }

    this.router.navigate(['/products'], { queryParams });
  }

  goToFarmerRegister() {
    this.router.navigate(['/login'], { queryParams: { mode: 'register', role: 'farmer' } });
  }

  isUserLoggedIn(): boolean {
    this.userSrv.getLoggedUser();
    return this.userSrv.loggedInUser != undefined && this.userSrv.loggedInUser.userId > 0;
  }
}
