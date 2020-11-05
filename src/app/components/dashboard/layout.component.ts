import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AccountService } from '@app/services';

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./dashboard.component.scss']
  })
export class LayoutComponent {
    constructor(
        private router: Router,
        private accountService: AccountService
    ) {
        // redirect to dashboard if already logged in
        if (this.accountService.userValue) {
            this.router.navigate(['/dashboard']);
        }
    }
}