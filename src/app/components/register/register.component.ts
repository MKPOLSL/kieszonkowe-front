
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '@app/services';

@Component({
  selector: 'app-register-mock',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterMockComponent implements OnInit {
    form: FormGroup;
    loading = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService
    ) { }

    isAdult: string;

    ngOnInit() {
        this.isAdult = this.setMaxDate();
        this.form = this.formBuilder.group({
            email: ['', Validators.required ],
            birthdate: ['', Validators.required ],
            username: ['', Validators.required],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    setMaxDate() {
        let actualDate = new Date().toISOString().substring(0,10);
        let minusEighteen = parseInt(actualDate.substr(0,4)) - 18;
        actualDate = actualDate.slice(4);
        actualDate = minusEighteen.toString() + actualDate;
        return actualDate;
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.loading = true;
        this.accountService.register(this.form.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.alertService.success('Registration successful', { keepAfterRouteChange: true });
                    this.router.navigate(['/login'], { relativeTo: this.route });
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }
}
