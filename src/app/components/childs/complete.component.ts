import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

import { AlertService } from '@app/services';
import { first } from 'rxjs/operators';
import { ChildrenService } from '@app/services/children.service';

@Component({
    selector: 'complete',
    templateUrl: 'complete.component.html',
    styleUrls: ['./child.component.scss'],
})
export class CompleteComponent implements OnInit {

    id: string;

    loading = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private alertService: AlertService,
        private childrenService: ChildrenService
    ) { }
    
    form = this.formBuilder.group({
        actualAmount: ['', Validators.required],
    });

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];
    }

    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;
        this.alertService.clear();
        if (this.form.invalid) {
            return;
        }
        this.childrenService.completeChildRecord(this.id, this.f.actualAmount.value)
            .pipe(first())
            .subscribe(data => {
                this.alertService.success('Pomyślnie uzupełniono rekord', { keepAfterRouteChange: true });
                this.router.navigate(['.', { relativeTo: this.route }]);
            },
            error => {
                this.alertService.error(error);
                this.loading = false;
            });
    }
}