import { Component, OnInit } from '@angular/core';
import { PersonalData } from './personalData'
import { personData } from './person-mock'


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  personalData=personData;

  userData:PersonalData
  

  constructor() { }

  ngOnInit(): void {
  }

  onNameInput (userData: PersonalData): void {
    this.userData = userData; 
  }

}
