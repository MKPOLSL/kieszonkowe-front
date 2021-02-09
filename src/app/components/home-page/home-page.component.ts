import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '@app/services';
import { AdminService } from '@app/services/admin.service';
import { StatisticsService } from '@app/services/statistics.service';
import { Statistics } from '@app/_models/statistics';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {
  data: string[] = [];
  randStatistics: Statistics = null;
  
  constructor(
    private router: Router,
    private accountService: AccountService,
    private adminService: AdminService, 
    private statisticsService: StatisticsService) {
    // redirect to dashboard if already logged in
    if (this.accountService.userValue) {  
      this.router.navigate(['/dashboard']);
    }
    if (this.adminService.adminValue) {
      this.router.navigate(['/dashboard']);
    }
  }

  ngOnInit(): void {
    this.statisticsService.getRandomStatistics()
        .pipe(first())
        .subscribe(data => {
          this.randStatistics = Object.assign(new Statistics(), data);
        })
  }
}
