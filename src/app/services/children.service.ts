import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Child } from "@app/_models/child";
import { environment } from "@environments/environment";

@Injectable({ providedIn: 'root' })
export class ChildrenService {

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
    }
    deleteChild(childId: string){
        return this.http.post(`${environment.apiUrl}/children/deleteChild`, JSON.stringify(childId), {'headers': { 'content-type': 'application/json'}});
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
    
    completeChildRecord(childId: string, actualAmount: number) {
        return this.http.post(`${environment.apiUrl}/children/complete`, { childId, actualAmount });
    }
}