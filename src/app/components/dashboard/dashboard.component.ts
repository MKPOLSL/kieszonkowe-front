import { Component, OnInit } from '@angular/core';

import { User } from '@app/_models';
import { AccountService } from '@app/services';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
  })
export class DashboardComponent implements OnInit {
    user: User;

    constructor(private accountService: AccountService) {
       
    }

    ngOnInit(){
        this.user = this.accountService.userValue;
    }
}