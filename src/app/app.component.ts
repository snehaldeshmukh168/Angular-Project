import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EmpAddEditComponent } from './emp-add-edit/emp-add-edit.component';
import { EmployeeService } from './services/employee.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CoreService } from './core/core.service';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  displayedColumns: string[] = ['id', 'firstName', 'lastName', 'email', 'dob', 'gender', 'education', 'company', 'experience', 'package', 'action'];
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private _dialog: MatDialog, private _empService: EmployeeService,
    private cdr: ChangeDetectorRef, private _coreService: CoreService
  ) { }

  ngOnInit(): void {
    this.getEmployeeList();
  }

  openAddEditEmpForm() {
    const dialogRef = this._dialog.open(EmpAddEditComponent);

    dialogRef.afterClosed().subscribe((shouldRefresh) => {
      if (shouldRefresh) {
        this.getEmployeeList(); // ✅ Refresh only if form was submitted
      }
    });
  }


  getEmployeeList() {
    this._empService.getEmployeeList().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res);

        // Small delay ensures paginator and sort are ready
        Promise.resolve().then(() => {
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });
      },
      error: (err) => console.error('Error fetching employees:', err),
    });
  }



  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteEmployee(id: number) {
    // this._empService.deleteEmployee(id).subscribe({
    //   next: (res) => {
    //     this._coreService.openSnackBar('Employee deleted!', 'done');
    //     this.getEmployeeList();
    //   },
    //   error: console.log,
    // });

    const dialogRef = this._dialog.open(ConfirmDialogComponent, {
      data: {
        message: "Are you sure you want to delete this employee?"
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this._empService.deleteEmployee(id).subscribe({
          next: (res) => {
            this._coreService.openSnackBar('Employee deleted!', 'done');
            this.getEmployeeList();
          },
         error: (err) => {
          console.error('Delete error:', err);
          this._coreService.openSnackBar('Failed to delete employee.', 'error');
         }
        });
      }
    });
  }

  openEditForm(data: any) {
    const dialogRef = this._dialog.open(EmpAddEditComponent, {
      data: data
    });

    dialogRef.afterClosed().subscribe((shouldRefresh) => {
      if (shouldRefresh) {
        this.getEmployeeList(); // ✅ Refresh only if form was submitted
      }
    });
  }

}
