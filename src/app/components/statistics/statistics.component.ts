import { Component, OnInit } from '@angular/core';
import { Education } from '@app/_models/education';
import { Region } from '@app/_models/region';
import { StatisticsService } from 'app/services/statistics.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '@app/services/alert.service';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { Statistics } from '@app/_models/statistics';
import { Chart} from 'chart.js'

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})

export class StatisticsComponent implements OnInit {
    loading = false;
    submitted = false;
    returnUrl: string;

    regions = null;
    educations = null;
    selectedRegion = null;
    selectedEducation = null;
    statistics : Statistics = null;

  constructor(
    private formBuilder: FormBuilder,
    private statisticsService: StatisticsService,
    private alertService: AlertService,
    private router: Router,
    private route: ActivatedRoute

  ) {}

  get f() { return this.form.controls; }

  form = this.formBuilder.group({
    region: ['', [Validators.required]],
    education: ['', [Validators.required]]
  });

  changeRegion(e) {
    this.region.setValue(e.target.value, {
      onlySelf: true
    })
  }

  changeEducationDegree(e) {
    this.education.setValue(e.target.value, {
      onlySelf: true
    })
  }

  get region() {
    return this.form.get('region');
  }

  get education() {
    return this.form.get('education')
  }

  ngOnInit(): void {
    var myChart = new Chart("myChart", {
      type: 'bar',
      data: {
          labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
          datasets: [{
              label: '# of Votes',
              data: [12, 19, 3, 5, 2, 3],
              backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)'
              ],
              borderColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)'
              ],
              borderWidth: 1
          }]
      },
      options: {
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero: true
                  }
              }]
          }
      }
  });
    this.statisticsService
    .getEducations()
    .pipe(first())
    .subscribe(educations => (this.educations = educations));

    this.statisticsService
    .getRegions()
    .pipe(first())
    .subscribe(regions => (this.regions = regions));
  }

  onSubmit() {
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.form.invalid) {
        return;
    }

    this.loading = true;

    this.statisticsService.sendRegionAndEducation(this.f.education.value, this.f.region.value)
        .pipe(first())
        .subscribe(
            data => {               
                this.statistics = Object.assign(new Statistics(), data);
                this.statistics.standardDeviationAmount = Math.round((this.statistics.standardDeviationAmount + Number.EPSILON) * 100) / 100
                this.router.navigate([this.returnUrl]);
            },
            error => {
                this.alertService.error(error);
                this.loading = false;
            });
}
}