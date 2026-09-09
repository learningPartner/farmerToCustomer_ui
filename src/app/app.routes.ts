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
import { Farmers } from './pages/farmers/farmers';
import { Aboutus } from './pages/aboutus/aboutus';
import { Blog } from './pages/blog/blog';
import { Privacypolicy } from './pages/privacypolicy/privacypolicy';
import { Termsofservice } from './pages/termsofservice/termsofservice';
import { Contact } from './pages/contact/contact';

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
    },
    {
        path:'farmers',
        component: Farmers
    },
    {
        path:'contact',
        component: Contact
    },
    {
        path:'aboutus',
        component: Aboutus
    },
    {
        path:'blog',
        component: Blog
    },
    {
        path:'privacypolicy',
        component: Privacypolicy
    },
    {
        path:'termsofservice',
        component: Termsofservice
    },
    {
        path:'contact',
        component: Contact
    }
];
