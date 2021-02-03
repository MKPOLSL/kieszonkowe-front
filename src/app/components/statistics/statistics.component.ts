import { Component, OnInit } from '@angular/core';
import { Education } from '@app/_models/education';
import { Region } from '@app/_models/region';
import { StatisticsService } from 'app/services/statistics.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '@app/services/alert.service';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';

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
                this.router.navigate([this.returnUrl]);
            },
            error => {
                this.alertService.error(error);
                this.loading = false;
            });
}
}