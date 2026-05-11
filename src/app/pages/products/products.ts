import { Component, inject, OnInit, signal } from '@angular/core';
import { MasterService } from '../../core/services/master';
import { Observable } from 'rxjs';
import { Category } from '../../core/models/classes/Master.model';
import { AsyncPipe, DatePipe, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductFilter } from '../../core/models/classes/Product.model';
import { ProductService } from '../../core/services/product';
import { IProductList } from '../../core/models/interfaces/product.interface';
import { ProductMasterService } from '../../core/services/product-master';
import { ProductMasterItem } from '../../core/models/classes/ProductMaster.model';
import { UserModelList } from '../../core/models/classes/User.Model';
import { UserService } from '../../core/services/user-service';

@Component({
  selector: 'app-products',
  imports: [AsyncPipe, DatePipe, FormsModule, NgClass],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products implements OnInit {

  filterObj: ProductFilter = new ProductFilter();
  productList = signal<IProductList[]>([]);
  productSrv = inject(ProductService);
  productMasterSrv = inject(ProductMasterService);
  userSrv = inject(UserService);

  masterSrv = inject(MasterService);
  categoryList: Observable<Category[]> = this.masterSrv.getCategorys();
  productMasterList = signal<ProductMasterItem[]>([]);
  farmerList = signal<UserModelList[]>([]);
  totalProducts = signal<number>(0);
  pagesArray: number[] = [];
  currentPage = signal<number>(1);

  ngOnInit(): void {
    this.getProductMasters();
    this.getFarmers();
    this.applyFilters();
  }

  getProductMasters() {
    this.productMasterSrv.getAllProductMasters().subscribe({
      next: (res) => {
        this.productMasterList.set(res.data ?? []);
      },
      error: () => {
        this.productMasterList.set([]);
      },
    });
  }

  getFarmers() {
    this.userSrv.getAllUsers().subscribe({
      next: (res) => {
        const users = res.data ?? [];
        this.farmerList.set(
          users.filter((user: UserModelList) =>
            user.roleName?.toLowerCase() === 'farmer' || user.roleId === 2
          )
        );
      },
      error: () => {
        this.farmerList.set([]);
      },
    });
  }

  applyFilters() {
    this.filterObj.pageNumber = this.currentPage();
    this.productSrv.filterProducts(this.filterObj).subscribe({
      next: (res: any) => {
        this.productList.set(res.data ?? []);
        this.totalProducts.set(res.totalRecords ?? 0);
        this.buildPages();
      },
      error: () => {
        this.productList.set([]);
        this.totalProducts.set(0);
        this.pagesArray = [];
      }
    });
  }

  setPage(pageNu:number) {
    this.filterObj.pageNumber = pageNu;
    this.currentPage.set(pageNu);
    this.applyFilters();
  }

  resetFilters() {
    this.filterObj = new ProductFilter();
    this.currentPage.set(1);
    this.applyFilters();
  }

  onApplyFilters() {
    const pageNumber = this.filterObj.pageNumber > 0 ? this.filterObj.pageNumber : 1;
    this.filterObj.pageNumber = pageNumber;
    this.currentPage.set(pageNumber);
    this.applyFilters();
  }

  onPageSizeChange() {
    this.currentPage.set(1);
    this.filterObj.pageNumber = 1;
    this.applyFilters();
  }

  goToPreviousPage() {
    if (this.currentPage() > 1) {
      this.setPage(this.currentPage() - 1);
    }
  }

  goToNextPage() {
    if (this.currentPage() < this.pagesArray.length) {
      this.setPage(this.currentPage() + 1);
    }
  }

  buildPages() {
    const totalPageCount = Math.ceil(this.totalProducts() / this.filterObj.pageSize);
    this.pagesArray = [];
    for (let index = 0; index < totalPageCount; index++) {
      this.pagesArray.push(index + 1);
    }
  }

  getShowingText(): string {
    if (this.totalProducts() === 0) {
      return 'No product listings found';
    }

    const start = (this.currentPage() - 1) * this.filterObj.pageSize + 1;
    const end = Math.min(this.currentPage() * this.filterObj.pageSize, this.totalProducts());
    return `Showing ${start} - ${end} of ${this.totalProducts()} available listings`;
  }

}
