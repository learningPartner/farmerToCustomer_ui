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
  productImage: string;
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

export interface IOrderList {
  orderId: number
  customerId: number
  customerName: string
  farmerId: number
  orderDate: string
  status: string
  city: string
  state: string
  pincode: string
  addressLine1: string
  addressLine2: string
}

