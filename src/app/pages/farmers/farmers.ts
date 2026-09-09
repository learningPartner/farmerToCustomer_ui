import { Component, inject, signal, OnInit } from '@angular/core';
import { UserModel } from '../../core/models/classes/User.Model';
import { UserService } from '../../core/services/user-service';
import { ProductService } from '../../core/services/product';
import { IProductList } from '../../core/models/interfaces/product.interface';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({selector:'app-farmers', imports:[DatePipe, FormsModule], templateUrl:'./farmers.html', styleUrl:'./farmers.css'})
export class Farmers implements OnInit {
 userService=inject(UserService); products=inject(ProductService);
 selectedFarmer=signal<UserModel|null>(null); allFarmers: (UserModel & {city?:string})[]=[];
 farmers=signal<UserModel[]>([]); listings=signal<IProductList[]>([]); listView=signal(false);
 search=''; name=''; city=''; pincode=''; product=''; loading=signal(true);
 ngOnInit(){this.userService.getAllUsers().subscribe({next:res=>{this.allFarmers=(res.data??[]).filter((u:UserModel)=>u.roleId===2);this.applyFilter();this.loading.set(false);},error:()=>this.loading.set(false)});
 this.products.getAllProducts().subscribe({next:res=>{this.listings.set(res.data??[]);this.applyFilter();},error:()=>{}});}
 openFarmerModal(farmer:UserModel){this.selectedFarmer.set(farmer);}
 closeFarmerModal(){this.selectedFarmer.set(null);}
 listingCount(id:number){return this.listings().filter(p=>p.farmerId===id).length;}
 applyFilter(){const has=(value:string|undefined, query:string)=>(value??'').toLowerCase().includes(query.trim().toLowerCase());
 this.farmers.set(this.allFarmers.filter(f=>{const names=this.listings().filter(p=>p.farmerId===f.userId).map(p=>p.productName).join(' ');
 return has(f.name,this.name)&&has(f.city || f.address,this.city)&&has(f.address,this.pincode)&&has(names,this.product)&&has([f.name,f.city,f.address,names].join(' '),this.search);}));}
 resetFilters(){this.search=this.name=this.city=this.pincode=this.product='';this.applyFilter();}
}
