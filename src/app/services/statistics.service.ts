import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment'

import { Region } from '../_models/region'
import { Education } from '../_models/education'

@Injectable({ providedIn: 'root' })
export class StatisticsService {
    private regionSubject: BehaviorSubject<Region[]>;
    public region: Observable<Region[]>;
    private educationSubject: BehaviorSubject<Education[]>;
    public education: Observable<Education[]>;

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.regionSubject = new BehaviorSubject<Region[]>(JSON.parse(localStorage.getItem('region')));
        this.region = this.regionSubject.asObservable();
        this.educationSubject = new BehaviorSubject<Education[]>(JSON.parse(localStorage.getItem('education')));
        this.education = this.educationSubject.asObservable();
    }
    getRegions(){
        return this.http.get<Region[]>(`${environment.apiUrl}/pocketmoney/regions`);
    }
    
    getEducations() {
        return this.http.get<Education[]>(`${environment.apiUrl}/pocketmoney/educations`);
    }

    sendRegionAndEducation(educationId, regionId){
        return this.http.post(`${environment.apiUrl}/pocketmoney/statistics`, { educationId, regionId});
    }
}