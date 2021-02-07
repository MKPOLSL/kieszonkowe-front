import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment'
import { Admin } from '@app/_models/admin';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Child } from '@app/_models/child';
import { User } from '@app/_models';
import { Education } from '@app/_models/education';
import { Region } from '@app/_models/region';

@Injectable({providedIn: 'root'})
export class AdminService {
  private adminSubject: BehaviorSubject<Admin>;
  public admin: Observable<Admin>;

  constructor(
      private router: Router,
      private http: HttpClient
  ) {
      this.adminSubject = new BehaviorSubject<Admin>(JSON.parse(localStorage.getItem('admin')));
      this.admin = this.adminSubject.asObservable();
  }

  public get adminValue(): Admin {
    return this.adminSubject.value;
  }

  login(username, password) {
    return this.http.post<Admin>(`${environment.apiUrl}/admin/authenticate`, { username, password })
        .pipe(map(admin => {
            // store admin details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('admin', JSON.stringify(admin));
            this.adminSubject.next(admin);
            return admin;
        }));
  }

  logout() {
    // remove user from local storage and set current user to null
    localStorage.removeItem('admin');
    this.adminSubject.next(null);
    this.router.navigate(['/home']);
  }

  getChildren() {
    return this.http.get<Child[]>(`${environment.apiUrl}/admin/panel/children`);
  }
  
  getParents() {
    return this.http.get<User[]>(`${environment.apiUrl}/admin/panel/parents`);
  }

  getRegions() {
    return this.http.get<Region[]>(`${environment.apiUrl}/admin/panel/regions`);
  }

  getEducations() {
    return this.http.get<Education[]>(`${environment.apiUrl}/admin/panel/educations`);
  }

  getAdministrators() {
    return this.http.get<Admin[]>(`${environment.apiUrl}/admin/panel/administrators`);
  }
}
