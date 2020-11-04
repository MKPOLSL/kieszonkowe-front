import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PersonalData } from './personalData'
import { personData } from './person-mock'
import { PersonalDataService } from '@app/services/personal-data.service'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { notUniqueUsernameValidator } from '@app/components/register/register-validators.directive'
import { Router, ActivatedRoute } from '@angular/router';


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

  

  constructor(public personalDataService: PersonalDataService,private formBuilder: FormBuilder, private http: HttpClient) { }

  ngOnInit(): void {
    this.getPersonalData();
    this.registerForm = this.formBuilder.group({      
      userName: ['',[ Validators.required, Validators.minLength(6)]],
      birthDate: [''],
      emailAddress: [''],
      password: ['']
    });
  }

  getPersonalData() : void {
    this.userData = this.personalDataService.getPersonalData(); 
  }

  // convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }

  // httpOptions = {
  //   headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  // };

  // httpOptions = {
  //   headers: new HttpHeaders({'Content-Type': 'multipart/form-data; charset=utf-8'})
  // }

  requestResponse;

  submitForm() {
    console.log(this.registerForm.value)
    var formData: any = new FormData();
    formData.append("userName", this.registerForm.get('userName').value);
    formData.append("birthDate", this.registerForm.get('birthDate').value);
    formData.append("emailAddress", this.registerForm.get('emailAddress').value);
    formData.append("password", this.registerForm.get('password').value);

    var userData = 
            {
              "userName": this.registerForm.get('userName').value,
              "birthDate": this.registerForm.get('birthDate').value,
              "emailAddress": this.registerForm.get('emailAddress').value,
              "password": this.registerForm.get('password').value
            }

    // this.http.post('https://localhost:44353/profile/register',formData, this.httpOptions).subscribe(
    //   (response) =>console.log(response),
    //   (error) => console.log(error)
    // )
    this.http.post('https://8e1c9b2d-7a9f-498c-9671-133a422cef11.mock.pstmn.io/profile/register',formData).subscribe(
      (response) => {
        console.log(response);
        this.requestResponse = response
      },
      (error) => {
        console.log(error);
        this.requestResponse = error.error.text;
        
      }        
    )

    
  }


  // onSubmit() {
  //     this.submitted = true;

  //     // stop here if form is invalid
  //     if (this.registerForm.invalid) {
  //         return;
  //     }
  //     alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.registerForm.value))
  // }

  // onNameInput (userData: PersonalData): void {
  //   this.userData = userData; 
  // }

}
