import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Employee } from '../employee/employee.model';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeServiceService {
  // private apiUrl = 'http://localhost:8080/employee';
  private apiUrl = 'https://curd-uiconndocker.onrender.com/employee';

  constructor(private http: HttpClient) { }

  addEmployee(employee: Employee): Observable<Employee>{
    return this.http.post<Employee>(`${this.apiUrl}/save`, employee);
  }

  getEmployees():Observable<Employee[]>{
    return this.http.get<any>(`${this.apiUrl}/getData`).pipe(
      map(reponse => reponse.result)
    );
  }
  
  getEmployeeById(id: number): Observable<Employee>{
    return this.http.get<{message: String, result: Employee }>(`${this.apiUrl}/getDataById/${id}`)
    .pipe(
      map(response => response.result)
    );
    // return this.http.get<Employee>(`${this.apiUrl}/getDataById/${id}`);
  }

  updateEmployee(employee: Employee): Observable<Employee>{
    return this.http.put<Employee>(`${this.apiUrl}/updateData`,employee);
  }

  deleteEmployee(id: number): Observable<any>{
    return this.http.delete(`${this.apiUrl}/deleteData/${id}`);
  }
  
}
