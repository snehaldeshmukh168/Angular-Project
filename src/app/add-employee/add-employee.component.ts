import { Component, OnInit } from '@angular/core';
import { Employee } from '../employee/employee.model';
import { EmployeeServiceService } from '../service/employee-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrl: './add-employee.component.css'
})
export class AddEmployeeComponent implements OnInit{

  employee: Employee = {
    id: 0,
    empFirstName: '',
    empLastName: '',
    empAddress: '',
    experience: '',
    company: '',
    salary: ''
  };

  isEditMode = false;
  constructor(private employeeService: EmployeeServiceService, private router: Router, private snackBar: MatSnackBar
    , private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.isEditMode = true;
        this.loadEmployee(id);
      }
    });
  }

  loadEmployee(id: number): void {
    this.employeeService.getEmployeeById(id).subscribe(emp => {
      this.employee = emp;
    });
  }

  onSubmit(): void {
    if (this.isEditMode) {
      //update employee
      this.employeeService.updateEmployee(this.employee).subscribe(() => {
        this.snackBar.open('Employee update successfully!', 'Close', { duration: 300 });
        this.router.navigate(['/employee']);
      });
    } else {

      //Add employee
      this.employeeService.addEmployee(this.employee).subscribe(() => {
        this.snackBar.open('Employee added successfully!', 'Close', { duration: 300 });
        this.router.navigate(['/employee']);
      });
    }
  }



  onCancel() {
    this.router.navigate(['/employee']);
  }
}
