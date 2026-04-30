 
import { Component, inject } from '@angular/core'; 
import { CommonImports } from '../../core/constant/CommonImports';
import { ProductService } from '../../core/services/product';

@Component({
  selector: 'app-home',
  imports: [CommonImports.FORM_IMPORTS,],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

 // productSrv =  inject(ProductService)
}
