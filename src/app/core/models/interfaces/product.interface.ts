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

export interface ICartItemView {
 productImage:  string;
  cartId: number
  customerId: number
  customerName: string
  farmerProductId: number
  productId: number
  productName: string
  farmerId: number
  farmerName: string
  quantity: number
  addedAt: string
  pricePerKg: number 

}
