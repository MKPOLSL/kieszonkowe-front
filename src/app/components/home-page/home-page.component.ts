import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '@app/services';
import { AdminService } from '@app/services/admin.service';
import { PocketMoneyService } from 'app/services/pocket-money.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {
  data: string[] = [];
  constructor(private service: PocketMoneyService,
    private router: Router,
    private accountService: AccountService,
    private adminService: AdminService) {
    // redirect to dashboard if already logged in
    if (this.accountService.userValue) {  
      this.router.navigate(['/dashboard']);
    }
    if (this.adminService.adminValue) {
      this.router.navigate(['/dashboard']);
    }
  }

  ngOnInit(): void {
    this.service.getAll().subscribe((data) => (this.data = data));
  }
}
