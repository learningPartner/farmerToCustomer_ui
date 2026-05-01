
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonImports } from '../../core/constant/CommonImports';
import { ProductService } from '../../core/services/product';
import { MasterService } from '../../core/services/master';
import { Category } from '../../core/models/classes/Master.model';
import { ApiResponseModel } from '../../core/models/interfaces/api-response.Model';
import { interval, map, Observable, Subscription } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { ProductMasterService } from '../../core/services/product-master';
import { IProductList } from '../../core/models/interfaces/product.interface';
import { NgOptimizedImage } from '@angular/common';
@Component({
  selector: 'app-home',
  imports: [CommonImports.FORM_IMPORTS,AsyncPipe,NgOptimizedImage],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit, OnDestroy {

  masterSrv = inject(MasterService)  
  productServ = inject(ProductService) ;
  productList = signal<IProductList[]>([]);
  selectedCategory = signal<string>("All");

  categorListObs$: Observable<Category[]> = new Observable<Category[]>;

  timer$ = interval(2000);

  ngOnInit(): void {
    this.categorListObs$ = this.masterSrv.getAllCategory().pipe(
      map((res:ApiResponseModel)=> res.data)
    );
    this.getAllProduct();
  }

  getProductByCateId(cat:Category) {
    this.selectedCategory.set(cat.name);
    this.productServ.getAllFarmerProductsByCatId(cat.categoryId).subscribe({
      next:(res:ApiResponseModel)=>{
        this.productList.set(res.data)
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
  ngOnDestroy(): void {
     
  }
}
