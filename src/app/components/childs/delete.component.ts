import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

import { AlertService } from '@app/services';
import { first } from 'rxjs/operators';
import { User } from '@app/_models/user';
import { ChildrenService } from '@app/services/children.service';

@Component({
    selector: 'delete',
    templateUrl: 'delete.component.html',
    styleUrls: ['./child.component.scss'],
})
export class DeleteComponent implements OnInit {

    id: string;

    loading = false;
    submitted = false;

    user : User;

    returnUrl: string;
    

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private childrenService: ChildrenService,
        private alertService: AlertService
    ) { }
    
    form = this.formBuilder.group({
        password: ['', Validators.required],
    });

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/children';
    }

    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;
        this.loading = true;
        this.alertService.clear();
        if (this.form.invalid) {
            return;
        }
        this.user = JSON.parse(localStorage.getItem('user'));

        if(this.user.password == this.f.password.value){
            this.childrenService.deleteChild(this.id)
            .pipe(first())
            .subscribe(
                data => {
                    this.alertService.success('Usunięto rekord dziecka', { keepAfterRouteChange: true });
                    this.router.navigate(['.', { relativeTo: this.route }]);
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
        }
        else{
            this.alertService.error("Wpisano złe hasło");
            this.loading = false;
        }
    }
}