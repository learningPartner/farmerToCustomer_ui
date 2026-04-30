import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmerProducts } from './FarmerProducts';

describe('Product', () => {
  let component: FarmerProducts;
  let fixture: ComponentFixture<FarmerProducts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FarmerProducts],
    }).compileComponents();

    fixture = TestBed.createComponent(FarmerProducts);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
