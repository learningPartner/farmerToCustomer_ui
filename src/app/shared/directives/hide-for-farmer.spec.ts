import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { UserService } from '../../core/services/user-service';
import { HideForFarmer } from './hide-for-farmer';
describe('HideForFarmer',()=>{
 it('hides controls for farmers',()=>{
 TestBed.configureTestingModule({providers:[{provide:UserService,useValue:{loggedInUser:{roleId:2}}}]});
 const element=document.createElement('div');
 TestBed.runInInjectionContext(()=>new HideForFarmer(new ElementRef(element)));
 expect(element.style.display).toBe('none');
 });
});
