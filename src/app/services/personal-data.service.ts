import { Injectable } from '@angular/core';
import { PersonalData } from  '@app/components/register-unused/personalData';
import { personData } from '@app/components/register-unused/person-mock';

@Injectable({
  providedIn: 'root'
})
export class PersonalDataService {

  constructor() { }

  getPersonalData(): PersonalData {
    return personData;
  }
}
