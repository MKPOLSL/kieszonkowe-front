import { Injectable } from '@angular/core';
import { PersonalData } from  '@app/components/register/personalData';
import { personData } from '@app/components/register/person-mock';

@Injectable({
  providedIn: 'root'
})
export class PersonalDataService {

  constructor() { }

  getPersonalData(): PersonalData {
    return personData;
  }
}
