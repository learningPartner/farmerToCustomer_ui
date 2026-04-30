import { DatePipe, DecimalPipe, JsonPipe, NgClass } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GlobalConstant } from '../../core/constant/Constant';
import { FarmerProduct } from '../../core/models/classes/Product.model';
import { UserModel } from '../../core/models/classes/User.Model';
import { ApiResponseModel } from '../../core/models/interfaces/api-response.Model';
import { ProductService } from '../../core/services/product';
import { ProductMasterItem } from '../../core/models/classes/ProductMaster.model';
import { ProductMasterService } from '../../core/services/product-master';
import { IProductList } from '../../core/models/interfaces/product.interface';
import { HideForFarmer } from '../../shared/directives/hide-for-farmer';
import { UserService } from '../../core/services/user-service';

@Component({
  selector: 'app-product',
  imports: [ReactiveFormsModule, NgClass, DatePipe, DecimalPipe, JsonPipe, HideForFarmer],
  templateUrl: './FarmerProducts.html',
  styleUrl: './FarmerProducts.css',
})
export class FarmerProducts implements OnInit {
  formBuilder = inject(FormBuilder);
  productSrv = inject(ProductService);
  productMasterSrv = inject(ProductMasterService);
   userService = inject(UserService);

  productForm!: FormGroup;
  productList = signal<IProductList[]>([]);
  productMasterList = signal<ProductMasterItem[]>([])
  isSubmitting = signal<boolean>(false);
  currentFarmerId = signal<number>(0);
  loggedInUser:  UserModel = new UserModel();

  constructor() {
    this.createProductForm();
    this.setLoggedInFarmer();

    // const localDta =  localStorage.getItem(GlobalConstant.LOCAL_LOGIN_KEY);
    // if(localDta != null) {
    //   this.loggedInUser =  JSON.parse(localDta)
    // }
    this.loggedInUser = this.userService.loggedInUser;
  }

  ngOnInit(): void {
    if(this.loggedInUser.roleId ==1) {
       this.getAllProducts();
    } else {
      this.getAllProductsByFarmerId();
    }
    this.getProductMaster();
  }

  createProductForm() {
    this.productForm = this.formBuilder.group({
      farmerProductId: [0],
      farmerId: [this.loggedInUser.userId, [Validators.required, Validators.min(1)]],
      productId: [0, [Validators.required, Validators.min(1)]],
      pricePerKg: [0, [Validators.required, Validators.min(0)]],
      availableQuantity: [0, [Validators.required, Validators.min(0)]],
      availableDate: ['', Validators.required],
      status: ['Available', Validators.required],
    });
  }

  getProductMaster() {
    this.productMasterSrv.getAllProductMasters().subscribe({
      next:(res:ApiResponseModel)=>{
        this.productMasterList.set(res.data);
      }
    })
  }

  setLoggedInFarmer() {
    const localData = localStorage.getItem(GlobalConstant.LOCAL_LOGIN_KEY);
    if (!localData) {
      this.patchDefaultFarmerId(0);
      return;
    }

    const loggedInUser: UserModel = JSON.parse(localData);
    const farmerId = loggedInUser?.userId ?? 0;
    this.currentFarmerId.set(farmerId);
    this.patchDefaultFarmerId(farmerId);
  }

  patchDefaultFarmerId(farmerId: number) {
    this.productForm.patchValue({
      farmerId,
      availableDate: this.getTodayDateTimeLocal(),
      status: 'Available',
    });
  }

  getTodayDateTimeLocal(): string {
    const now = new Date();
    const offset = now.getTimezoneOffset();
    const localTime = new Date(now.getTime() - offset * 60000);
    return localTime.toISOString().slice(0, 16);
  }

  getAllProducts() {
    this.productSrv.getAllProducts().subscribe({
      next: (response: ApiResponseModel) => {
        this.productList.set(response.data ?? []);
      },
      error: () => {
        this.productList.set([]);
      },
    });
  }

  getAllProductsByFarmerId() {
    this.productSrv.getAllProductsByLoggedFarmer(this.loggedInUser.userId).subscribe({
      next: (response: ApiResponseModel) => {
        this.productList.set(response.data ?? []);
      },
      error: () => {
        this.productList.set([]);
      },
    });
  }

  onSaveProduct() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    const formValue = this.mapFormToPayload();

    this.productSrv.createProduct(formValue).subscribe({
      next: (response: ApiResponseModel) => {
        alert('Product saved successfully');
        this.productList.update((oldData) => [...oldData, response.data ?? formValue]);
        this.resetForm();
        this.isSubmitting.set(false);
      },
      error: () => {
        this.isSubmitting.set(false);
        alert('Unable to save product');
      },
    });
  }

  onUpdateProduct() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    const formValue = this.mapFormToPayload();

    this.productSrv.updateProduct(formValue).subscribe({
      next: () => {
        alert('Product updated successfully');
        this.productList.update((items) =>
          items.map((item) =>
            item.farmerProductId === formValue.farmerProductId ? { ...item, ...formValue } : item
          )
        );
        this.resetForm();
        this.isSubmitting.set(false);
      },
      error: () => {
        this.isSubmitting.set(false);
        alert('Unable to update product');
      },
    });
  }

  onDeleteProduct(item: FarmerProduct) {
    const isConfirmed = confirm(`Delete product entry #${item.farmerProductId}?`);
    if (!isConfirmed) {
      return;
    }

    this.productSrv.deleteProduct(item.farmerProductId).subscribe({
      next: () => {
        alert('Product deleted successfully');
        this.productList.update((items) =>
          items.filter((product) => product.farmerProductId !== item.farmerProductId)
        );
        if (this.productForm.controls['farmerProductId'].value === item.farmerProductId) {
          this.resetForm();
        }
      },
      error: () => {
        alert('Unable to delete product');
      },
    });
  }

  onEditProduct(item: FarmerProduct) {
    this.productForm.patchValue({
      farmerProductId: item.farmerProductId,
      farmerId: item.farmerId,
      productId: item.productId,
      pricePerKg: item.pricePerKg,
      availableQuantity: item.availableQuantity,
      availableDate: this.toDateTimeLocal(item.availableDate),
      status: item.status,
    });
  }

  resetForm() {
    this.productForm.reset({
      farmerProductId: 0,
      farmerId: this.currentFarmerId(),
      productId: 0,
      pricePerKg: 0,
      availableQuantity: 0,
      availableDate: this.getTodayDateTimeLocal(),
      status: 'Available',
    });
  }

  mapFormToPayload(): FarmerProduct {
    const formValue = this.productForm.getRawValue();
    return {
      ...formValue,
      availableDate: new Date(formValue.availableDate).toISOString(),
    };
  }

  toDateTimeLocal(dateValue: string): string {
    if (!dateValue) {
      return this.getTodayDateTimeLocal();
    }

    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) {
      return this.getTodayDateTimeLocal();
    }

    const offset = date.getTimezoneOffset();
    const localTime = new Date(date.getTime() - offset * 60000);
    return localTime.toISOString().slice(0, 16);
  }

  trackByProductId(_: number, item: FarmerProduct) {
    return item.farmerProductId;
  }

  getAvailableProductsCount(): number {
    return this.productList().filter((item) => item.status === 'Available').length;
  }
}
