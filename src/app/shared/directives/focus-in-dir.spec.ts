import { ElementRef } from '@angular/core';
import { FocusInDir } from './focus-in-dir';

describe('FocusInDir', () => {
  it('should create an instance', () => {
    const directive = new FocusInDir(new ElementRef(document.createElement('input')));
    expect(directive).toBeTruthy();
  });
});
