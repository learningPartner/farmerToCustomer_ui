import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MasterService } from '../../core/services/master';
import { ApiResponseModel } from '../../core/models/interfaces/api-response.Model';
import { Category, Role } from '../../core/models/classes/Master.model';
import { NgClass } from '@angular/common';
import { FocusInDir } from '../../shared/directives/focus-in-dir';
@Component({
  selector: 'app-master',
  imports: [ReactiveFormsModule, NgClass, FocusInDir],
  templateUrl: './master.html',
  styleUrl: './master.css',
})
export class Master implements OnInit {

  roleForm!: FormGroup;
  categoryForm!: FormGroup;

  currentTabVisiable = signal<string>("Role");

  roleList = signal<Role[]>([])
  categoryList = signal<Category[]>([])

  formBuilder = inject(FormBuilder)
  masterSrv = inject(MasterService)

  constructor() {
    this.createCategoryForm();
    this.createRoleForm()
  }

  ngOnInit(): void {
    this.getAllCategory();
    this.getAllRole();
  }

  toggleForm(tabeName: string) {
    this.currentTabVisiable.set(tabeName)
  }

  onRoleEdit(roleData: Role) {
    this.roleForm.patchValue(roleData)
  }

  onEditCat(cat: Category) {
    this.categoryForm.setValue(cat)
  }

  createRoleForm() {
    this.roleForm = new FormGroup({
      roleId: new FormControl(0),
      roleName: new FormControl('')
    })
  }
  createCategoryForm() {
    try {
      this.categoryForm = this.formBuilder.group({
        categoryId: [0],
        name: ['']
      })
    } catch (error) {

    } 
  }

  getAllCategory() {
    
    this.masterSrv.getAllCategory().subscribe({
      next: (rs: ApiResponseModel) => {
        this.categoryList.set(rs.data)
      }
    })
  }
  getAllRole() {
    
    this.masterSrv.getAllRoles().subscribe({
      next: (rs: ApiResponseModel) => {
        this.roleList.set(rs.data)
      }
    })
  }

  onSaveRole() {
    const formValue = this.roleForm.value;
    this.masterSrv.createRole(formValue).subscribe({
      next: (resposne: ApiResponseModel) => {
        alert("Role Saved");
        this.roleList.update(oldData => [...oldData, resposne.data])
        //this.getAllRole()
        this.roleForm.reset()
      },
      error:(errro)=>{

      }
    })
  }
  onUpdateRole() {
    const formValue = this.roleForm.value;
    this.masterSrv.updateRole(formValue).subscribe({
      next: (resposne: ApiResponseModel) => {
        alert("Role Saved");
        // const oldArray = this.roleList()
        // const editRec =  oldArray.find(m=>m.roleId ==formValue.roleId);
        // if(editRec !== undefined) {
        //   editRec.roleName = formValue.roleName;
        // }
        // setTimeout(() => {
        //      this.roleList.set(oldArray)
        // }, 2000);
        this.roleList.update(arr =>
          arr.map(user =>
            user.roleId === formValue.roleId ? { ...user, roleName: formValue.roleName } : user
          )
        );

      },error:(errro)=>{
        
      }
    })
  }
  onSaveCategory() {
    const formValue = this.categoryForm.value;
    this.masterSrv.createCategory(formValue).subscribe({
      next: (resposne: ApiResponseModel) => {
        alert("Category Saved");
        this.getAllCategory()
      }
    })
  }
  onUpdateCategory() {
    const formValue = this.categoryForm.value;
    this.masterSrv.updateCategory(formValue).subscribe({
      next: (resposne: ApiResponseModel) => {
        alert("Category Saved");
        this.getAllCategory()
      }
    })
  }

}
