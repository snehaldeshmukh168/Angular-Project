import { Component, OnInit, ViewChild, } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Employee } from '../employee/employee.model';
import { MatPaginator } from '@angular/material/paginator';
import { EmployeeServiceService } from '../service/employee-service.service';
import { AppRoutingModule } from '../app-routing.module';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css'
})
export class EmployeeListComponent implements OnInit {

  displayedColumns: string[] = ['id', 'empFirstName', 'empLastName',
    'empAddress', 'experience', 'company', 'salary', 'actions'];
  dataSource = new MatTableDataSource<Employee>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private employeeService: EmployeeServiceService, private router: Router, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.employeeService.getEmployees().subscribe((data) => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim();
    const id = Number(filterValue);

    if (!isNaN(id)) {
      this.employeeService.getEmployeeById(id).subscribe({
        next: (employee: Employee) => {
          this.dataSource.data = [employee];
          if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
          }
        },
        
        error: (err) => {
          console.error('Employee not found', err);
          this.dataSource.data = [];
        }
      });
    } else {
      this.loadEmployees();
    }
  }

  navigateToAddEmployee() {
    this.router.navigate(['/add-employee']);
  }

  editEmployee(id: number): void {
    this.router.navigate(['/edit-employee', id]);
  }

  deleteEmployee(id: number): void {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.employeeService.deleteEmployee(id).subscribe(() => {
        this.snackBar.open('Employee deleted successfully!', 'Close', { duration: 3000 });
        this.loadEmployees();
      })
    }
  }
}
