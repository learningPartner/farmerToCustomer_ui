import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-alert',
  imports: [NgClass],
  templateUrl: './alert.html',
  styleUrl: './alert.css',
})
export class Alert {

  @Input() alertType: string | 'Success' | 'Error'| 'Warning' = '';

  @Input() alertTitle: string = '';
  @Input() alertMessage: string = '';
}
