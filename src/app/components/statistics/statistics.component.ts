import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { StatisticsService } from 'app/services/statistics.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})

export class StatisticsComponent implements OnInit {
    regions = null;
    educations = null;

  constructor(private statisticsService: StatisticsService) { 
  }

  ngOnInit(): void {
    this.statisticsService.getEducations().subscribe((educations) => (this.educations = educations));
    this.statisticsService.getRegions().subscribe((regions) => (this.regions = regions));
  }
}