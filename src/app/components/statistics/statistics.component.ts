import { Component, OnInit } from '@angular/core';
import { StatisticsService } from 'app/services/statistics.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '@app/services/alert.service';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { Statistics } from '@app/_models/statistics';
import { Chart } from 'chart.js'
import {MatRadioModule} from '@angular/material/radio';
import {FormsModule} from '@angular/forms';
import { NgForm } from '@angular/forms';
import { Region } from '@app/_models/region';

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

  regions : Region[] = null;
  educations = null;
  selectedRegion = null;
  selectedEducation = null;
  statistics: Statistics = null;

  regionSelector : string = "Województwa";
  regionOptions : string[] = ['Miasta', 'Województwa'];

  cities : Region[] = new Array();
  voivodeships : Region[] = new Array();

  constructor(
    private formBuilder: FormBuilder,
    private statisticsService: StatisticsService,
    private alertService: AlertService,
    private router: Router,
    private route: ActivatedRoute

  ) { }

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
      .subscribe(regions => {
        this.regions = regions;//Object.assign(Region[], regions);
        regions.forEach(element => {
          if(element.isCity == true){
            this.cities.push(element);
          } else {
            this.voivodeships.push(element);
          }
        });
      });
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

    this.statisticsService.sendRegionAndEducation(this.f.education.value, this.f.region.value)
      .pipe(first())
      .subscribe(
        data => {
          if (data != null) {
            this.statistics = Object.assign(new Statistics(), data);
            this.statistics.standardDeviationAmount = Math.round((this.statistics.standardDeviationAmount + Number.EPSILON) * 100) / 100
            this.router.navigate([this.returnUrl]);
          }
        },
        error => {
          this.alertService.error("Za mało wyników w bazie dla tego regionu i stopnia edukacji");
          this.loading = false;
        });
  }
}