import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Child } from '@app/_models/child'

import { AccountService, AlertService } from '@app/services';
import { StatisticsService } from 'app/services/statistics.service';
import { Region } from '@app/_models/region';
import { Education } from '@app/_models/education';
import { AppRoutingModule } from '@app/app-routing.module';

@Component({
    selector: 'add-edit',
    templateUrl: 'add-edit.component.html',
    styleUrls: ['./child.component.scss'],
})
export class AddEditComponent implements OnInit {
    id: string;
    isAddMode: boolean;
    loading = false;
    submitted = false;
    
    child: Child = null;
    educations: Education[] = new Array();
    cities: Region[] = new Array();
    voivodeships: Region[] = new Array();

    constructor(
        private statisticsService: StatisticsService,
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService,
        private appRoutingModule: AppRoutingModule
    ) { }

    form = this.formBuilder.group({
        name: ['', Validators.required],
        education: ['', Validators.required],
        region: ['', Validators.required],
        plannedAmount: ['', Validators.required],
    });


    ngOnInit() {
        this.id = this.route.snapshot.params['id'];
        this.isAddMode = !this.id;

        if(!this.isAddMode) {
            this.accountService.getChild(this.id)
                .pipe(first())
                .subscribe(child => { this.child = child
                    this.f.name.setValue(child.name);
                    this.f.education.setValue(child.education.educationDegree);
                    this.f.region.setValue(child.region.regionName);
                    this.f.plannedAmount.setValue(child.plannedAmount);
                })
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
                    if (element.isCity == true) {
                        this.cities.push(element);
                    } else {
                        this.voivodeships.push(element);
                    }
                });
            });

    }

    get f() { return this.form.controls; }

    onSubmitAdd() {
        this.submitted = true;
        this.alertService.clear();
        if (this.form.invalid) {
            return;
        }
        this.loading = true;
        this.createChild();
    }

    onSubmitEdit() {
        this.submitted = true;
        this.alertService.clear();
        if (this.form.invalid) {
            return;
        }
        this.updateChild();
    }


    private updateChild() {
        let user = JSON.parse(localStorage.getItem('user'));
        this.accountService.hideChild(this.child.id)
            .pipe(first())
            .subscribe();
        this.accountService.addChild(this.form.value, user.id)
            .pipe(first())
            .subscribe(
                data => {
                    this.alertService.success('Zmodyfikowano rekord dziecka', { keepAfterRouteChange: true });
                    this.router.navigate(['.', { relativeTo: this.route }]);
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });

    }

    private createChild() {
        let user = JSON.parse(localStorage.getItem('user'));
        if(!user.isActive) {
            user.isActive = true;
            localStorage.setItem('user', JSON.stringify(user));
        }
        this.accountService.addChild(this.form.value, user.id)
            .pipe(first())
            .subscribe(
                data => {
                    this.router.navigate(['.', { relativeTo: this.route }])
                       .then(() => {
                           window.location.reload();
                       });
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }


}