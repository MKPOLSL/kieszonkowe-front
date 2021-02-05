import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import  { Child } from '@app/_models/child'

import { AccountService, AlertService} from '@app/services';
import {  StatisticsService } from 'app/services/statistics.service';
import { Region } from '@app/_models/region';
import { Education } from '@app/_models/education';

@Component({
    selector: 'add-edit',
    templateUrl: 'add-edit.component.html',
    styleUrls: ['./child.component.scss'],
  })
export class AddEditComponent implements OnInit {
    form: FormGroup;
    id: string;
    isAddMode: boolean;
    loading = false;
    submitted = false;
    // Pobrać te dane z backendu             <----          TODO
    educations : Education[] = new Array();
    cities : Region[] = new Array();
    voivodeships : Region[] = new Array();
    selectedEducation: string = null;
    selectedRegion: string = null;

    constructor(
        private statisticsService: StatisticsService,
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService
    ) {}

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];
        this.isAddMode = !this.id;
                
        this.form = this.formBuilder.group({
            name: ['', Validators.required],
            education: ['', Validators.required],
            region: ['', Validators.required],
            plannedAmount: ['', Validators.required],
            actualAmount: ['', Validators.required]
        });

        if (!this.isAddMode) {
            this.accountService.getById(this.id)
                .pipe(first())
                .subscribe(x => {
                    this.f.firstName.setValue(x.email);
                    this.f.lastName.setValue(x.id);
                    this.f.username.setValue(x.username);
                });
        }

        this.statisticsService
        .getEducations()
        .pipe(first())
        .subscribe(educations => this.educations = educations);
  
      this.statisticsService
        .getRegions()
        .pipe(first())
        .subscribe(regions => {
            regions.forEach(element => {
              if(element.isCity == true){
                this.cities.push(element);
              } else {
                this.voivodeships.push(element);
              }
            });
          });

    }

    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;

        this.alertService.clear();

        if (this.form.invalid) {
            return;
        }

        this.loading = true;
        if (this.isAddMode) {
            this.createChild();
        } else {
            this.updateUser();
        }
    }

    private updateUser() {
        this.accountService.update(this.id, this.form.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.alertService.success('Update successful', { keepAfterRouteChange: true });
                    this.router.navigate(['..', { relativeTo: this.route }]);
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }

    private createChild() {
        let user = JSON.parse(localStorage.getItem('user'));
        this.accountService.addChild(this.form.value, user.id)
            .pipe(first())
            .subscribe(
                data => {
                    this.alertService.success('Child added successfully', { keepAfterRouteChange: true });
                    this.router.navigate(['.', { relativeTo: this.route }]);
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }
  

}