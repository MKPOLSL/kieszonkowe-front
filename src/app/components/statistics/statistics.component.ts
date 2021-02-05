import { Component, OnInit } from '@angular/core';
import { StatisticsService } from 'app/services/statistics.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '@app/services/alert.service';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { Statistics } from '@app/_models/statistics';
import { Chart } from 'chart.js'
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { Region } from '@app/_models/region';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})

export class StatisticsComponent implements OnInit {

  isSubmitted = false;


  loading = false;
  submitted = false;
  returnUrl: string;

  regions: Region[] = null;
  educations = null;

  statistics: Statistics = null;
  statisticsArray: Statistics[] = null;

  regionSelector: string = "Województwa";
  regionOptions: string[] = ['Miasta', 'Województwa'];

  cities: Region[] = new Array();
  voivodeships: Region[] = new Array();

  visualizeStatistics = false;
  myChart: Chart = null;

  constructor(
    private formBuilder: FormBuilder,
    private statisticsService: StatisticsService,
    private alertService: AlertService,
    private router: Router,
    private route: ActivatedRoute

  ) { }

  get f() { return this.form.controls; }

  form = this.formBuilder.group({
    region: [''],
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
    this.statisticsService
      .getEducations()
      .pipe(first())
      .subscribe(educations => (this.educations = educations));

    this.statisticsService
      .getRegions()
      .pipe(first())
      .subscribe(regions => {
        this.regions = regions;//Object.assign(Region[], regions);
        regions.forEach(element => {
          if (element.isCity == true) {
            this.cities.push(element);
          } else {
            this.voivodeships.push(element);
          }
        });
      });
  }

  displayDataonChart(statisticsArray) {
    var regionsTable: String[] = new Array();
    var meansTable: number[] = new Array();
    statisticsArray.forEach(element => {
      regionsTable.push(element.regionName);
      meansTable.push(element.meanAmount)
    });
    if (!this.myChart) {
      this.myChart = new Chart("Statistics", {
        type: 'bar',
        data: {
          labels: regionsTable,
          datasets: [{
            label: 'Średnia dla danego regionu',
            data: meansTable,
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
    } else {
        this.myChart.data.labels = regionsTable;
        this.myChart.data.datasets[0].data = meansTable;
        this.myChart.update();
    }
   
  }

  roundStatistics(statistics: Statistics) {
    statistics.standardDeviationAmount = Math.round((statistics.standardDeviationAmount + Number.EPSILON) * 100) / 100
    statistics.meanAmount = Math.round((statistics.meanAmount + Number.EPSILON) * 100) / 100
    statistics.medianAmount = Math.round((statistics.medianAmount + Number.EPSILON) * 100) / 100
    statistics.modeAmount = Math.round((statistics.modeAmount + Number.EPSILON) * 100) / 100
    return statistics
  }

  onSubmit() {
    this.submitted = true;

    this.statistics = null;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    if (!this.visualizeStatistics) {
      this.statisticsService.sendRegionAndEducation(this.f.education.value, this.f.region.value)
        .pipe(first())
        .subscribe(
          data => {
            if (data != null) {
              this.statistics = Object.assign(new Statistics(), data);
              this.statistics = this.roundStatistics(this.statistics)
            }
            this.loading = false;
          },
          error => {
            this.alertService.error("Za mało wyników w bazie dla tego regionu i stopnia edukacji");
            this.loading = false;
          });
    }
    else {
      this.statisticsService.sendEducation(this.f.education.value, (this.regionSelector == "Miasta"))
        .pipe(first())
        .subscribe(
          data => {
            if (data != null) {
              this.statisticsArray = Object.assign(new Array(), data);
              this.displayDataonChart(this.statisticsArray);
              this.statisticsArray.forEach((element) => 
                element = this.roundStatistics(element)
              )
            }
            this.loading = false;
          },
          error => {
            this.alertService.error("Za mało wyników w bazie dla tego regionu i stopnia edukacji");
            this.loading = false;
          });
    }
  }

  onSubmitActual() {
    this.submitted = true;

    this.statistics = null;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    if (!this.visualizeStatistics) {
      this.statisticsService.sendRegionAndEducationActual(this.f.education.value, this.f.region.value)
        .pipe(first())
        .subscribe(
          data => {
            if (data != null) {
              this.statistics = Object.assign(new Statistics(), data);
              this.statistics = this.roundStatistics(this.statistics)
            }
            this.loading = false;
          },
          error => {
            this.alertService.error("Za mało wyników w bazie dla tego regionu i stopnia edukacji");
            this.loading = false;
          });
    }
    else {
      this.statisticsService.sendEducationActual(this.f.education.value, (this.regionSelector == "Miasta"))
        .pipe(first())
        .subscribe(
          data => {
            if (data != null) {
              this.statisticsArray = Object.assign(new Array(), data);
              this.displayDataonChart(this.statisticsArray);
              this.statisticsArray.forEach((element) => 
                element = this.roundStatistics(element)
              )
            }
            this.loading = false;
          },
          error => {
            this.alertService.error("Za mało wyników w bazie dla tego regionu i stopnia edukacji");
            this.loading = false;
          });
    }
  }
}