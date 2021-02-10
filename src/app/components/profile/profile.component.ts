import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '@app/services';
import { AccountService } from '@app/services/account.service';
import { SnackBarService } from '@app/snack-bar.service';
import { User } from '@app/_models/user';
import { first } from 'rxjs/operators';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  dataForm: FormGroup;
  passwordForm: FormGroup;

  loadingPasswordForm = false;
  loadingDataForm

  isAdult = false;

  passwordSubmitted = false;
  passwordNotConfirmed = true;

  dataSubmitted = false;

  passwordValidation = false;
  dataValidation = false;

  user: User;

  constructor(
    private formBuilder: FormBuilder,
    private accountService: AccountService,
    private alertService: AlertService,
    private snackBarService: SnackBarService
  ) { }

  ngOnInit(): void {

    this.dataForm = this.formBuilder.group({
      email: ['', [Validators.email, Validators.required]],
      username: ['', Validators.required],
      birthDate: ['', Validators.required],
      actual: ['', Validators.required]
    })

    this.passwordForm = this.formBuilder.group({
      actual: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmation: ['', [Validators.required, Validators.minLength(6)]]
    })

    this.user = JSON.parse(localStorage.getItem('user'));
    this.updateDataFormFields();

  }

  updateDataFormFields() {
    this.dataF.username.setValue(this.user.username);
    this.dataF.email.setValue(this.user.email);
    this.dataF.birthDate.setValue(this.user.birthDate);
  }

  setMaxDate() {
    let actualDate = new Date().toISOString().substring(0, 10);
    let minusEighteen = parseInt(actualDate.substr(0, 4)) - 18;
    actualDate = actualDate.slice(4);
    actualDate = minusEighteen.toString() + actualDate;
    return actualDate;
  }

  get dataF() { return this.dataForm.controls; }
  get passwordF() { return this.passwordForm.controls; }

  checkPasswordConfirmation() {
    return this.passwordF.password.value === this.passwordF.confirmation.value;
  }

  onSubmitDataChange() {
    this.dataSubmitted = true;
    this.alertService.clear();

    if (this.user.password === this.dataF.actual.value) {

      this.dataValidation = true;

      if (this.dataForm.invalid) {
        return;
      }

      var date = parseInt(this.dataF.birthDate.value.substring(0, 4));
      var currentDate = parseInt(new Date().toISOString().substring(0, 4));
      if (currentDate - date < 18) {
        this.alertService.error('Aby korzystać z tej strony musisz mieć conajmniej 18 lat!', { keepAfterRouteChange: true });
        return;
      }

      this.loadingDataForm = true;
      this.accountService.updateParentData(
        this.user.id, this.dataF.username.value,
        this.dataF.email.value, this.dataF.birthDate.value)
        .pipe(first())
        .subscribe(data => {
          this.user = Object.assign(new User(), data);
          localStorage.setItem('user', JSON.stringify(this.user));
          this.updateDataFormFields();
          this.snackBarService.openSnackBar("Pomyślnie zmodyfikowano dane użytkownika", "OK");
          this.loadingDataForm = false;
        },
          error => {
            this.alertService.error(error);
            this.loadingDataForm = false;
          });
    }
    return;

  }

  onSubmitPasswordChange() {
    this.passwordSubmitted = true;
    this.passwordNotConfirmed = !this.checkPasswordConfirmation();
    this.alertService.clear();

    if (this.user.password === this.passwordF.actual.value) {

      this.passwordValidation = true;

      if (this.passwordForm.invalid) {
        return;
      }

      this.loadingPasswordForm = true;
      this.accountService.updateParentPassword(
        this.user.id, this.passwordF.password.value)
        .pipe(first()).subscribe(data => {
          this.user = Object.assign(new User(), data);
          localStorage.setItem('user', JSON.stringify(this.user));
          this.snackBarService.openSnackBar("Pomyślnie zmodyfikowano dane użytkownika", "OK");
          this.loadingPasswordForm = false;
        },
          error => {
            this.alertService.error(error);
            this.loadingPasswordForm = false;
          });
    }

    return;
  }


}
