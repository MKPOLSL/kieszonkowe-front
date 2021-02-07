import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService, AlertService } from '@app/services';
import { AdminService } from '@app/services/admin.service';
import { User } from '@app/_models';
import { Admin } from '@app/_models/admin';
import { Child } from '@app/_models/child';
import { Education } from '@app/_models/education';
import { Region } from '@app/_models/region';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss']
})
export class PanelComponent implements OnInit {
  
  regions: Region[] = null;
  admins: Admin[] = null;
  children: Child[] = null;
  users = null;
  educations: Education[] = null;

  loading = false;
  submitted = false;
  isAddMode = true;

  formChild = this.formBuilder.group({
    ID: [''],
    parentID: [''],
    name: ['', Validators.required],
    education: ['', Validators.required],
    region: ['', Validators.required],
    plannedAmount: ['', Validators.required],
    isHidden: ['', Validators.required],
    actualAmount: ['']
  });

  formAdmin = this.formBuilder.group({
    ID: [''],
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  formParent = this.formBuilder.group({
    ID: [''],
    username: ['', Validators.required],
    password: ['', Validators.required],
    email: ['', Validators.required],
    birthdate: ['', Validators.required],
    isActive: ['', Validators.required]
  });

  formRegion = this.formBuilder.group({
    ID: [''],
    regionName: ['', Validators.required],
    isCity: ['', Validators.required]
  });

  formEducation = this.formBuilder.group({
    ID: [''],
    educationDegree: ['', Validators.required]
  });

  get fChild() { return this.formChild.controls; }
  get fParent() { return this.formParent.controls; }
  get fRegion() { return this.formRegion.controls; }
  get fEducation() { return this.formEducation.controls; }
  get fAdmin() { return this.formAdmin.controls; }

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private adminService: AdminService,
    private accountService: AccountService,
    private alertService: AlertService
  ) { }


  ngOnInit(): void {
    this.adminService.getRegions()
      .pipe(first())
      .subscribe(data => {
         this.regions = data;
      })
    this.adminService.getEducations()
      .pipe(first())
      .subscribe(data => {
         this.educations = data;
      })
    this.adminService.getAdministrators()
      .pipe(first())
      .subscribe(data => {
         this.admins = data;
      })
    this.adminService.getChildren()
      .pipe(first())
      .subscribe(data => {
         this.children = data;
      })
    this.adminService.getParents()
      .pipe(first())
      .subscribe(data => {
         this.users = data;
      })  
  }

  editChild(childId) {  
    this.isAddMode = false;
    var child = this.children.find(child => child.id === childId);
    this.fChild.ID.setValue(child.id);
    this.fChild.parentID.setValue(child.parentId);
    this.fChild.name.setValue(child.name);
    this.fChild.education.setValue(child.education.educationDegree);
    this.fChild.region.setValue(child.region.regionName);
    this.fChild.plannedAmount.setValue(child.plannedAmount);
    this.fChild.isHidden.setValue(child.isHidden);
    this.fChild.actualAmount.setValue(child.actualAmount);
  }

  deleteChild(childId) {
    this.children = this.children.filter(element => element.id != childId);
  }

  editUser(userId) {  
    this.isAddMode = false;
    var user = this.users.find(user => user.id === userId);
    this.fParent.ID.setValue(user.id);
    this.fParent.username.setValue(user.username);
    this.fParent.password.setValue(user.password);
    this.fParent.email.setValue(user.email);
    this.fParent.birthdate.setValue(user.birthdate);
    this.fParent.isActive.setValue(user.isActive);
  }

  deleteUser(userId) {
    this.users = this.users.filter(element => element.id != userId);
  }


  onSubmitChild() {

  }

  onSubmitParent() {
    
  }

}
