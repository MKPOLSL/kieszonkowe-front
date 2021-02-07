import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment'

import { User } from '@app/_models';
import { Child } from '@app/_models/child';

@Injectable({ providedIn: 'root' })
export class AccountService {
    private userSubject: BehaviorSubject<User>;
    public user: Observable<User>;

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
        this.user = this.userSubject.asObservable();
    }

    public get userValue(): User {
        return this.userSubject.value;
    }

    login(username, password) {
        return this.http.post<User>(`${environment.apiUrl}/profile/authenticate`, { username, password })
            .pipe(map(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('user', JSON.stringify(user));
                this.userSubject.next(user);
                return user;
            }));
    }

    logout() {
        // remove user from local storage and set current user to null
        localStorage.removeItem('user');
        this.userSubject.next(null);
        this.router.navigate(['/home']);
    }

    updateParentPassword(Id, password){
        return this.http.post(`${environment.apiUrl}/profile/updateUserPassword`, {Id, password});
    }

    updateParentData(Id, username, email, birthDate){
        return this.http.post(`${environment.apiUrl}/profile/updateUserData`, {Id, username, email, birthDate});
    }

    deleteChild(childId: string){
        return this.http.post(`${environment.apiUrl}/children/deleteChild`, JSON.stringify(childId), {'headers': { 'content-type': 'application/json'}});
    }

    register(user: User) {
        return this.http.post(`${environment.apiUrl}/profile/register`, user);
    }

    addChild(child: Child, parentId: string) {
        return this.http.post(`${environment.apiUrl}/children/addChild`, { parentId, child });
    }

    getChildren(parentId: string) {
        return this.http.get<Child[]>(`${environment.apiUrl}/children/children?parentId=${parentId}`);
    }

    getChild(childId: string) {
        return this.http.get<Child>(`${environment.apiUrl}/children/child?childId=${childId}`);
    }
    
    hideChild(childId: string) {
        return this.http.post(`${environment.apiUrl}/children/hide`, JSON.stringify(childId), {'headers': { 'content-type': 'application/json'}});
    }   

    completeChildRecord(childId: string, actualAmount: number) {
        return this.http.post(`${environment.apiUrl}/children/complete`, { childId, actualAmount });
    }

    getById(id: string) {
        return this.http.get<User>(`${environment.apiUrl}/users/${id}`);
    }

    update(id, params) {
        return this.http.put(`${environment.apiUrl}/users/${id}`, params)
            .pipe(map(x => {
                // update stored user if the logged in user updated their own record
                if (id == this.userValue.id) {
                    // update local storage
                    const user = { ...this.userValue, ...params };
                    localStorage.setItem('user', JSON.stringify(user));

                    // publish updated user to subscribers
                    this.userSubject.next(user);        
                }
                return x;
            }));
    }

    delete(id: string) {
        return this.http.delete(`${environment.apiUrl}/users/${id}`)
            .pipe(map(x => {
                // auto logout if the logged in user deleted their own record
                if (id == this.userValue.id) {
                    this.logout();
                }
                return x;
            }));
    }
}