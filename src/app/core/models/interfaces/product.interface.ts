export interface IProductList {
  farmerProductId: number
  farmerId: number
  farmerName: string
  productId: number
  productName: string
  pricePerKg: number
  availableQuantity: number
  availableDate: string
  status: string
  image: string;
}

export interface ICartModel {
  cartId: number
  customerId: number
  farmerProductId: number
  quantity: number
  addedAt: Date
}
