import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { beforeDeactiveGuardGuard } from './core/guards/before-deactive-guard-guard';
export const routes: Routes = [
    {
        path:'',
        redirectTo:'home',
        pathMatch:'full'
    },
    {
        path:'home',
        loadComponent: () => import('./pages/home/home').then(m => m.Home)
    },
    { 
        path: 'login',
        loadComponent: () => import('./pages/login/login').then(m => m.Login)
    },
    { 
        path: 'products',
        loadComponent: () => import('./pages/products/products').then(m => m.Products)
    },
    {
        path:'master',
        loadComponent: () => import('./pages/master/master').then(m => m.Master),
        data: { roles: [1] },
        canActivate: [authGuard] 
    },
    {
        path:'product',
        loadComponent: () => import('./pages/farmerproduct/FarmerProducts').then(m => m.FarmerProducts),
        data: { roles: [1, 2] },
        canActivate: [authGuard]
    },
    {
        path:'product-master',
        loadComponent: () => import('./pages/product-master/product-master').then(m => m.ProductMaster),
        data: { roles: [1] },
        canActivate: [authGuard]
    },
     {
        path:'checkout',
        loadComponent: () => import('./pages/checkout/checkout').then(m => m.Checkout),
        canActivate: [authGuard]
    },
    {
        path:'orders',
        loadComponent: () => import('./pages/orders/orders').then(m => m.Orders),
        canActivate: [authGuard]
    },
    {
        path:'farmers',
        loadComponent: () => import('./pages/farmers/farmers').then(m => m.Farmers)
    },
    {
        path:'contact',
        loadComponent: () => import('./pages/contact/contact').then(m => m.Contact)
    },
    {
        path:'aboutus',
        loadComponent: () => import('./pages/aboutus/aboutus').then(m => m.Aboutus)
    },
    {
        path:'blog',
        loadComponent: () => import('./pages/blog/blog').then(m => m.Blog)
    },
    {
        path:'privacypolicy',
        loadComponent: () => import('./pages/privacypolicy/privacypolicy').then(m => m.Privacypolicy)
    },
    {
        path:'termsofservice',
        loadComponent: () => import('./pages/termsofservice/termsofservice').then(m => m.Termsofservice)
    },
    { path: '**', redirectTo: 'home' }
];
