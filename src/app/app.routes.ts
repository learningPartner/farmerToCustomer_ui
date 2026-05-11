import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Category } from './pages/category/category';
import { authGuard } from './core/guards/auth-guard';
import { beforeDeactiveGuardGuard } from './core/guards/before-deactive-guard-guard';
import { Master } from './pages/master/master';
import { FarmerProducts } from './pages/farmerproduct/FarmerProducts';
import { ProductMaster } from './pages/product-master/product-master';
import { Checkout } from './pages/checkout/checkout';
import { Orders } from './pages/orders/orders';
import { Products } from './pages/products/products';

export const routes: Routes = [
    {
        path:'',
        redirectTo:'home',
        pathMatch:'full'
    },
    {
        path:'home',
        component: Home
    },
    { 
        path: 'login',
        component: Login
    },
     { 
        path: 'products',
        component: Products
    },
    {
        path:'master',
        component: Master,
        canActivate: [authGuard] 
    },
    {
        path:'product',
        component: FarmerProducts,
        canActivate: [authGuard]
    },
    {
        path:'product-master',
        component: ProductMaster,
        canActivate: [authGuard]
    },
     {
        path:'checkout',
        component: Checkout,
        canActivate: [authGuard]
    },
     {
        path:'orders',
        component: Orders,
        canActivate: [authGuard]
    }
];
