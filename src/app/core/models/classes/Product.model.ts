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
