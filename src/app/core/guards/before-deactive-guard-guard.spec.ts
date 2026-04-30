import { TestBed } from '@angular/core/testing';
import { CanDeactivateFn } from '@angular/router';

import { beforeDeactiveGuardGuard } from './before-deactive-guard-guard';

describe('beforeDeactiveGuardGuard', () => {
  const executeGuard: CanDeactivateFn<unknown> = (...guardParameters) =>
    TestBed.runInInjectionContext(() => beforeDeactiveGuardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
