import { Component } from '@angular/core';
import { AccountService } from './services';
import { AdminService } from './services/admin.service';
import { User } from './_models';
import { Admin } from './_models/admin';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Serwis kieszonkowe.pl';
  user: User;
  admin: Admin;

    constructor(
      private accountService: AccountService, 
      private adminService: AdminService) {
        this.accountService.user.subscribe(user => this.user = user);
        this.adminService.admin.subscribe(admin => this.admin = admin)
    }

    logout() {
        this.accountService.logout();
    }

    adminLogout() {
        this.adminService.logout();
    }
}
