import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddEmployeeComponent } from './add-employee/add-employee.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';


const routes: Routes = [
  {path: 'add-employee', component: AddEmployeeComponent},
  {path: 'edit-employee/:id', component:AddEmployeeComponent},
  {path: 'employee', component: EmployeeListComponent},
  {path: '',redirectTo: 'employee', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
