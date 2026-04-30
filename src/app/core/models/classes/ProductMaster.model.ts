export class ProductMasterItem {
  productId: number;
  name: string;
  categoryId: number;
  description: string;
  image: string;

  constructor() {
    this.productId = 0;
    this.name = '';
    this.categoryId = 0;
    this.description = '';
    this.image = '';
  }
}
