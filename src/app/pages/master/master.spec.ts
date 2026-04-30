import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Master } from './master';

describe('Master', () => {
  let component: Master;
  let fixture: ComponentFixture<Master>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Master],
    }).compileComponents();

    fixture = TestBed.createComponent(Master);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
