import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AccountService } from '@app/services';
import { AdminService } from '@app/services/admin.service';

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./dashboard.component.scss']
  })
export class LayoutComponent {
    constructor(
        private router: Router,
        private accountService: AccountService,
        private adminService: AdminService
    ) {
        // redirect to dashboard if already logged in
        if (this.accountService.userValue) {
            this.router.navigate(['/dashboard']);
        }
        if (this.adminService.adminValue) {
            this.router.navigate(['/dashboard']);
        }
    }
}