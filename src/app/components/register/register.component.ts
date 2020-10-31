import { Component, OnInit } from '@angular/core';
import { PersonalData } from './personalData'
import { personData } from './person-mock'
import { PersonalDataService } from '@app/services/personal-data.service'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  personalData:PersonalData;

  userData:PersonalData
  
  registerForm: FormGroup;
  submitted = false;

  constructor(public personalDataService: PersonalDataService,private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.getPersonalData();
    this.registerForm = this.formBuilder.group({
      userName: ['', Validators.required]
  });
  }

  getPersonalData() : void {
    // this.userData = this.personalDataService.getPersonalData(); 
  }

  // convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }

  onSubmit() {
      this.submitted = true;

      // stop here if form is invalid
      if (this.registerForm.invalid) {
          return;
      }

      alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.registerForm.value))
  }

  // onNameInput (userData: PersonalData): void {
  //   this.userData = userData; 
  // }

}
