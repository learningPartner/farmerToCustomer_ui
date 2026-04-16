 
import { Component } from '@angular/core'; 
import { CommonImports } from '../../core/constant/CommonImports';

@Component({
  selector: 'app-home',
  imports: [CommonImports.FORM_IMPORTS],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
