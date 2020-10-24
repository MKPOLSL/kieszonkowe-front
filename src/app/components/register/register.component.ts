import { Component, OnInit } from '@angular/core';
import { PersonalData } from './personalData'


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  personal_data: PersonalData;

  constructor() { }

  ngOnInit(): void {
  }

}
