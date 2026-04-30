import { CanDeactivateFn } from '@angular/router';

export const beforeDeactiveGuardGuard: CanDeactivateFn<unknown> = (
  component,
  currentRoute,
  currentState,
  nextState,
) => {
  
  return true;
};
