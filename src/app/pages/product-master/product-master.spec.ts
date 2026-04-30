import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductMaster } from './product-master';

describe('ProductMaster', () => {
  let component: ProductMaster;
  let fixture: ComponentFixture<ProductMaster>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductMaster],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductMaster);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
