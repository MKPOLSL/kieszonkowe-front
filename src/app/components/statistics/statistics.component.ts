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
  sortAscending = false;

  selectedTabIndex = 0;

  backgroundColors = [
    'rgba(255, 99, 132, 0.2)',
    'rgba(54, 162, 235, 0.2)',
    'rgba(255, 206, 86, 0.2)',
    'rgba(75, 192, 192, 0.2)',
    'rgba(153, 102, 255, 0.2)',
    'rgba(255, 159, 64, 0.2)'
  ]

  borderColors = [
    'rgba(255, 99, 132, 1)',
    'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(255, 159, 64, 1)'
  ]



  constructor(
    private formBuilder: FormBuilder,
    private statisticsService: StatisticsService,
    private alertService: AlertService,
    private router: Router,
    private route: ActivatedRoute

  ) { }

  get f() { return this.form.controls; }
  get fActual() { return this.formActual.controls; }

  form = this.formBuilder.group({
    region: [''],
    education: ['', [Validators.required]]
  });

  formActual = this.formBuilder.group({
    regionActual: [''],
    educationActual: ['', [Validators.required]]
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

  changeRegionActual(e) {
    this.regionActual.setValue(e.target.value, {
      onlySelf: true
    })
  }

  changeEducationDegreeActual(e) {
    this.educationActual.setValue(e.target.value, {
      onlySelf: true
    })
  }

  get region() {
    return this.form.get('region');
  }

  get education() {
    return this.form.get('education')
  }

  get regionActual() {
    return this.formActual.get('regionActual');
  }

  get educationActual() {
    return this.formActual.get('educationActual')
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
        this.regions = regions;
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
    if(this.myChart){
      this.myChart.destroy();
    }
    var bgColors = [];
    for (var i = 0; i < regionsTable.length; i++) {
      bgColors.push(this.backgroundColors[i % this.backgroundColors.length]);  
    }
    var bColors = [];
    for (var i = 0; i < regionsTable.length; i++) {
      bColors.push(this.borderColors[i % this.borderColors.length]);  
    }
    this.myChart = new Chart("Statistics", {
        type: 'bar',
        data: {
          labels: regionsTable,
          datasets: [{
            label: 'Średnia dla danego regionu',
            data: meansTable,
            backgroundColor: bgColors,
            borderColor: bColors,
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
    this.statisticsArray = null;
    this.selectedTabIndex = 0;

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
    this.statisticsArray = null;
    this.selectedTabIndex = 0;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.formActual.invalid) {
      return;
    }

    this.loading = true;
    if (!this.visualizeStatistics) {
      this.statisticsService.sendRegionAndEducationActual(this.fActual.educationActual.value, this.fActual.regionActual.value)
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
      this.statisticsService.sendEducationActual(this.fActual.educationActual.value, (this.regionSelector == "Miasta"))
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

  onTabChanged(e) {
    let clickedIndex = e.index;
    if(clickedIndex == 1){
      this.displayDataonChart(this.statisticsArray);
    }
  }

  onCheckboxChange(event) {
    if(!this.visualizeStatistics){
      this.selectedTabIndex = 0;
    }
  }

  onCheckboxSortChange(event){
    if(this.sortAscending){
      this.statisticsArray.sort((data1, data2) => 
        (data1.meanAmount - data2.meanAmount));
        this.displayDataonChart(this.statisticsArray);
    }
    else{
      this.statisticsArray.sort((data1, data2) => 
        (data2.meanAmount - data1.meanAmount));
        this.displayDataonChart(this.statisticsArray);
    }
  }
}