import { DatePipe, NgClass } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ApiResponseModel } from '../../core/models/interfaces/api-response.Model';
import { IOrderList } from '../../core/models/interfaces/product.interface';
import { OrderService } from '../../core/services/order-service';
import { UserService } from '../../core/services/user-service';

@Component({
  selector: 'app-orders',
  imports: [DatePipe, NgClass],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class Orders implements OnInit {
  orderService = inject(OrderService);
  userService = inject(UserService);

  orderList = signal<IOrderList[]>([]);
  selectedOrder = signal<any | null>(null);
  selectedOrderItems = signal<any[]>([]);
  selectedOrderId = signal<number>(0);
  isOrderLoading = signal<boolean>(false);

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders() {
    const userId = this.userService.loggedInUser.userId;
    const orderRequest =
      this.userService.loggedInUser.roleId === 2
        ? this.orderService.getOrdersByFarmerId(userId)
        : this.orderService.getOrdersByCustomerId(userId);

    orderRequest.subscribe({
      next: (orders: IOrderList[]) => {
        this.orderList.set(orders ?? []);
        if (this.orderList().length > 0) {
          this.openOrderDetails(this.orderList()[0]);
        }
      },
      error: () => {
        this.orderList.set([]);
        this.selectedOrder.set(null);
        this.selectedOrderItems.set([]);
      },
    });
  }

  openOrderDetails(order: IOrderList) {
    this.selectedOrderId.set(order.orderId);
    this.selectedOrder.set(order);
    this.selectedOrderItems.set([]);
    this.isOrderLoading.set(true);

    this.orderService.getOrderByOrderId(order.orderId).subscribe({
      next: (res: ApiResponseModel) => {
        this.mapSelectedOrderResponse(res.data, order);
        this.isOrderLoading.set(false);
      },
      error: () => {
        this.selectedOrder.set(order);
        this.selectedOrderItems.set([]);
        this.isOrderLoading.set(false);
      },
    });
  }

  mapSelectedOrderResponse(data: any, fallbackOrder: IOrderList) {
    if (Array.isArray(data)) {
      this.selectedOrder.set(data[0] ?? fallbackOrder);
      this.selectedOrderItems.set(data);
      return;
    }

    if (data?.order) {
      this.selectedOrder.set(data.order);
      this.selectedOrderItems.set(Array.isArray(data.orderItems) ? data.orderItems : []);
      return;
    }

    const detail = data ?? fallbackOrder;
    const items =
      detail.orderItems ??
      detail.orderDetails ??
      detail.products ??
      detail.items ??
      detail.cartItems ??
      [];

    this.selectedOrder.set(detail);
    this.selectedOrderItems.set(Array.isArray(items) ? items : []);
  }

  getOrderTotal(): number {
    return this.selectedOrderItems().reduce((total, item) => total + this.getItemTotal(item), 0);
  }

  getItemTotal(item: any): number {
    const directTotal = Number(item.totalAmount ?? item.totalPrice ?? item.amount ?? 0);
    if (directTotal > 0) {
      return directTotal;
    }

    return this.getItemPrice(item) * this.getItemQuantity(item);
  }

  getItemPrice(item: any): number {
    return Number(item.pricePerKg ?? item.price ?? item.rate ?? 0);
  }

  getItemQuantity(item: any): number {
    return Number(item.quantity ?? item.qty ?? 0);
  }

  getItemProductName(item: any): string {
    return item.productName ?? item.name ?? 'Product';
  }

  getItemFarmerName(item: any): string {
    return item.farmerName ?? item.sellerName ?? 'Farmer';
  }

  getItemImage(item: any): string {
    return (
      item.productImage ??
      item.image ??
      'https://images.pexels.com/photos/1300972/pexels-photo-1300972.jpeg?auto=compress&cs=tinysrgb&w=500'
    );
  }

  getOrderStatus(order: any): string {
    return order?.status ?? 'Order Placed';
  }
}
