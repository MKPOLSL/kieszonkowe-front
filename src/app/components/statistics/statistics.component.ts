import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Education } from '@app/_models/education';
import { Region } from '@app/_models/region';
import { StatisticsService } from 'app/services/statistics.service';

import { first } from 'rxjs/operators';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})

export class StatisticsComponent implements OnInit {
    regions: Region[] = null;
    educations: Education[] = null;

  constructor(private statisticsService: StatisticsService) { 
  }

  ngOnInit(): void {
    this.statisticsService.getEducations()
        .pipe(first())
        .subscribe(educations => (this.educations = educations));

    this.statisticsService.getRegions()
        .pipe(first())
        .subscribe(regions => (this.regions = regions));
  }
}