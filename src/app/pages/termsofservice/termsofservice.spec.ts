import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Termsofservice } from './termsofservice';

describe('Termsofservice', () => {
  let component: Termsofservice;
  let fixture: ComponentFixture<Termsofservice>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Termsofservice],
    }).compileComponents();

    fixture = TestBed.createComponent(Termsofservice);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
