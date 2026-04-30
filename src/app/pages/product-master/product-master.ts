import { CommonModule, NgClass, SlicePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Category } from '../../core/models/classes/Master.model';
import { ProductMasterItem } from '../../core/models/classes/ProductMaster.model';
import { ApiResponseModel } from '../../core/models/interfaces/api-response.Model';
import { MasterService } from '../../core/services/master';
import { ProductMasterService } from '../../core/services/product-master';
import { FocusInDir } from '../../shared/directives/focus-in-dir';

@Component({
  selector: 'app-product-master',
  imports: [ReactiveFormsModule, NgClass, CommonModule, SlicePipe,FocusInDir],
  templateUrl: './product-master.html',
  styleUrl: './product-master.css',
})
export class ProductMaster implements OnInit {
  formBuilder = inject(FormBuilder);
  productMasterSrv = inject(ProductMasterService);
  masterSrv = inject(MasterService);

  productMasterForm!: FormGroup;
  productMasterList = signal<ProductMasterItem[]>([]);
  categoryList = signal<Category[]>([]);
  isSubmitting = signal<boolean>(false);

  constructor() {
    this.createForm();
  }

  ngOnInit(): void {
    this.getAllCategories();
    this.getAllProductMasters();
  }

  createForm() {
    this.productMasterForm = this.formBuilder.group({
      productId: [0],
      name: ['', [Validators.required]],
      categoryId: [0, [Validators.required, Validators.min(1)]],
      description: ['', [Validators.required]],
      image: ['', [Validators.required]],
    });
  }

  getAllCategories() {
    this.masterSrv.getAllCategory().subscribe({
      next: (response: ApiResponseModel) => {
        this.categoryList.set(response.data ?? []);
      },
      error: () => {
        this.categoryList.set([]);
      },
    });
  }

  getAllProductMasters() {
    this.productMasterSrv.getAllProductMasters().subscribe({
      next: (response: ApiResponseModel) => {
        this.productMasterList.set(response.data ?? []);
      },
      error: () => {
        this.productMasterList.set([]);
      },
    });
  }

  onSaveProductMaster() {
    if (this.productMasterForm.invalid) {
      this.productMasterForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    const formValue = this.getPayload();

    this.productMasterSrv.createProductMaster(formValue).subscribe({
      next: (response: ApiResponseModel) => {
        alert('Product master saved successfully');
        this.productMasterList.update((items) => [...items, response.data ?? formValue]);
        this.resetForm();
        this.isSubmitting.set(false);
      },
      error: () => {
        this.isSubmitting.set(false);
        alert('Unable to save product master');
      },
    });
  }

  onUpdateProductMaster() {
    if (this.productMasterForm.invalid) {
      this.productMasterForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    const formValue = this.getPayload();

    this.productMasterSrv.updateProductMaster(formValue).subscribe({
      next: () => {
        alert('Product master updated successfully');
        this.productMasterList.update((items) =>
          items.map((item) => (item.productId === formValue.productId ? { ...item, ...formValue } : item))
        );
        this.resetForm();
        this.isSubmitting.set(false);
      },
      error: () => {
        this.isSubmitting.set(false);
        alert('Unable to update product master');
      },
    });
  }

  onEditProductMaster(item: ProductMasterItem) {
    this.productMasterForm.patchValue(item);
  }

  onDeleteProductMaster(item: ProductMasterItem) {
    const isConfirmed = confirm(`Delete product master #${item.productId}?`);
    if (!isConfirmed) {
      return;
    }

    this.productMasterSrv.deleteProductMaster(item.productId).subscribe({
      next: () => {
        alert('Product master deleted successfully');
        this.productMasterList.update((items) => items.filter((product) => product.productId !== item.productId));
        if (this.productMasterForm.controls['productId'].value === item.productId) {
          this.resetForm();
        }
      },
      error: () => {
        alert('Unable to delete product master');
      },
    });
  }

  resetForm() {
    this.productMasterForm.reset({
      productId: 0,
      name: '',
      categoryId: 0,
      description: '',
      image: '',
    });
  }

  getPayload(): ProductMasterItem {
    return this.productMasterForm.getRawValue();
  }

  getCategoryName(categoryId: number): string {
    const category = this.categoryList().find((item) => item.categoryId === categoryId);
    return category?.name ?? `Category #${categoryId}`;
  }

  getImagePreview(): string {
    return this.productMasterForm.controls['image'].value || 'https://placehold.co/600x400?text=Product+Preview';
  }

  getFilledImageCount(): number {
    return this.productMasterList().filter((item) => !!item.image).length;
  }

  trackByProductId(_: number, item: ProductMasterItem) {
    return item.productId;
  }
}
