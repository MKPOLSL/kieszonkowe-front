import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '@app/services';
import { AccountService } from '@app/services/account.service';
import { User } from '@app/_models/user';
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

  passwordChanged = false; // <---------------------------- Komunikaty 
  passwordSubmitted = false;
  passwordNotConfirmed = true;

  dataChanged = false; // <---------------------------- Komunikaty 
  dataSubmitted = false;

  user : User;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {

    this.dataForm = this.formBuilder.group({
      email: ['', [Validators.email, Validators.required]],
      username: ['', Validators.required],
      birthDate: ['', Validators.required],
    })

    this.passwordForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmation: ['', [Validators.required, Validators.minLength(6)]]
    })
    
    this.user = JSON.parse(localStorage.getItem('user'));
          
    this.dataF.username.setValue(this.user.username);
    this.dataF.email.setValue(this.user.email);
    this.dataF.birthDate.setValue(this.user.birthDate);


  }

  setMaxDate() {
    let actualDate = new Date().toISOString().substring(0,10);
    let minusEighteen = parseInt(actualDate.substr(0,4)) - 18;
    actualDate = actualDate.slice(4);
    actualDate = minusEighteen.toString() + actualDate;
    return actualDate;
  }

  get dataF() { return this.dataForm.controls; }
  get passwordF() { return this.passwordForm.controls; }

  checkPasswordConfirmation(){
    return this.passwordF.password.value === this.passwordF.confirmation.value;
  }

  onSubmitDataChange(){
    this.dataSubmitted = true;

    this.alertService.clear();
       
    if (this.dataForm.invalid) {
        return;
    }

    var date = parseInt(this.dataF.birthdate.value.substring(0, 4));
    var currentDate = parseInt(new Date().toISOString().substring(0,4));
    if(currentDate - date < 18) {
        this.alertService.error('Aby korzystać z tej strony musisz mieć conajmniej 18 lat!', { keepAfterRouteChange: true });
        return;
    }

    this.loadingDataForm = true;

  }

  onSubmitPasswordChange(){
    this.passwordSubmitted = true;
    this.passwordNotConfirmed = !this.checkPasswordConfirmation();
    this.alertService.clear();

    if (this.passwordForm.invalid) {
        return;
    }

    this.loadingPasswordForm = true;
  }

}
