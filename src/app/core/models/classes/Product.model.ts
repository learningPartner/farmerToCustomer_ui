export class FarmerProduct {
  farmerProductId: number;
  farmerId: number;
  productId: number;
  pricePerKg: number;
  availableQuantity: number;
  availableDate: string;
  status: string;

  constructor() {
    this.farmerProductId = 0;
    this.farmerId = 0;
    this.productId = 0;
    this.pricePerKg = 0;
    this.availableQuantity = 0;
    this.availableDate = '';
    this.status = 'Available';
  }
}


export class ProductFilter {
  categoryId: number;
  productId: number;
  farmerId: number;
  productName: string;
  farmerName: string;
  status: string;
  minPrice: number;
  maxPrice: number;
  minAvailableQuantity: number;
  availableFromDate: string;
  availableToDate: string;
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  sortDirection: string;

  constructor() {
    this.categoryId = 0;
    this.productId = 0;
    this.farmerId = 0;
    this.productName = '';
    this.farmerName = '';
    this.status = '';
    this.minPrice = 0;
    this.maxPrice = 0;
    this.minAvailableQuantity = 0;
    this.availableFromDate = '';
    this.availableToDate = '';
    this.pageNumber = 1;  
    this.pageSize = 5;   
    this.sortBy = '';
    this.sortDirection = '';
  }
}

 