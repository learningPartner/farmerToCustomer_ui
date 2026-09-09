import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptors, HttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { tokenInterceptor } from '../interceptors/token-interceptor';
import { GlobalConstant } from '../constant/Constant';
import { environment } from '../../../environments/environment';
import { UserService } from './user-service';
import { Checkout } from '../../pages/checkout/checkout';
import { OrderService } from './order-service';
import { Login } from '../../pages/login/login';

describe('Shopping flow regressions',()=>{
 beforeEach(()=>{localStorage.clear();TestBed.configureTestingModule({providers:[provideRouter([]),provideHttpClient(withInterceptors([tokenInterceptor])),provideHttpClientTesting(),MessageService]});});
 afterEach(()=>{TestBed.inject(HttpTestingController).verify();localStorage.clear();});
 it('does not retry a failed order submission',()=>{
  TestBed.inject(HttpClient).post(environment.API_URL+'farmerOrders/create-order',{}).subscribe({error:()=>{}});
  const http=TestBed.inject(HttpTestingController);http.expectOne(environment.API_URL+'farmerOrders/create-order').flush({}, {status:500,statusText:'Error'});
  http.expectNone(environment.API_URL+'farmerOrders/create-order');
 });
 it('does not send the API token to another host',()=>{
  localStorage.setItem(GlobalConstant.TOKEN_KEY,'example');TestBed.inject(HttpClient).get('https://example.org/image').subscribe();
  const request=TestBed.inject(HttpTestingController).expectOne('https://example.org/image');expect(request.request.headers.has('Authorization')).toBe(false);request.flush({});
 });
 it('clears both token and user when logging out',()=>{
  localStorage.setItem(GlobalConstant.LOCAL_LOGIN_KEY,JSON.stringify({userId:7}));localStorage.setItem(GlobalConstant.TOKEN_KEY,'example');
  const users=TestBed.inject(UserService);users.logout();expect(users.loggedInUser.userId).toBe(0);expect(localStorage.getItem(GlobalConstant.TOKEN_KEY)).toBeNull();expect(localStorage.getItem(GlobalConstant.LOCAL_LOGIN_KEY)).toBeNull();
 });
 it('recovers from malformed stored user data',()=>{localStorage.setItem(GlobalConstant.LOCAL_LOGIN_KEY,'{broken');expect(TestBed.inject(UserService).loggedInUser.userId).toBe(0);});
 it('calculates the cart total immediately and blocks an incomplete address',()=>{
  const checkout=TestBed.runInInjectionContext(()=>new Checkout());checkout.loading.set(false);
  checkout.cartData.set([{pricePerKg:25,quantity:2,farmerId:1},{pricePerKg:40,quantity:1.5,farmerId:2}] as any);
  expect(checkout.total()).toBe(110);expect(checkout.farmerCount()).toBe(2);
  const save=vi.spyOn(TestBed.inject(OrderService),'onSaveOrder');checkout.onSaveOrder();expect(save).not.toHaveBeenCalled();
 });
 it('prevents duplicate orders while a request is pending',()=>{
  const checkout=TestBed.runInInjectionContext(()=>new Checkout());checkout.loading.set(false);checkout.cartData.set([{pricePerKg:25,quantity:2}] as any);
  Object.assign(checkout.orderObj,{city:'Pune',state:'Maharashtra',pincode:'411001',addressLine1:'Test street'});
  const pending=new Subject<any>();const save=vi.spyOn(TestBed.inject(OrderService),'onSaveOrder').mockReturnValue(pending);
  checkout.onSaveOrder();checkout.onSaveOrder();expect(save).toHaveBeenCalledTimes(1);pending.complete();
 });
 it('allows registration after correcting mismatched passwords',()=>{
  const login=TestBed.runInInjectionContext(()=>new Login());login.registerForm.patchValue({name:'Test',email:'test@example.org',phone:'9999999999',roleId:3,address:'Test',password:'abcdef',confirmPassword:'wrong'});
  expect(login.registerForm.invalid).toBe(true);login.registerForm.patchValue({confirmPassword:'abcdef'});expect(login.registerForm.valid).toBe(true);
 });
});
