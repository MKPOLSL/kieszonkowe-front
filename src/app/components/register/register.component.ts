import { Component, OnInit } from '@angular/core';
import { PersonalData } from './personalData'
import { personData } from './person-mock'
import { PersonalDataService } from '@app/services/personal-data.service'


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  personalData:PersonalData;

  userData:PersonalData
  

  constructor(public personalDataService: PersonalDataService) { }

  ngOnInit(): void {
    this.getPersonalData();
  }

  getPersonalData() : void {
    this.userData = this.personalDataService.getPersonalData(); 
  }

  onNameInput (userData: PersonalData): void {
    this.userData = userData; 
  }

}
