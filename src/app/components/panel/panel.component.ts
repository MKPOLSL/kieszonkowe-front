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
  users: User[] = null;
  educations: Education[] = null;

  loading = false;
  submitted = false;
  isAddMode = true;

  formChild = this.formBuilder.group({
    parentID: [''],
    name: ['', Validators.required],
    education: ['', Validators.required],
    region: ['', Validators.required],
    plannedAmount: ['', Validators.required],
    actualAmount: ['']
  });

  formAdmin = this.formBuilder.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  formParent = this.formBuilder.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
    email: ['', Validators.required],
    birthdate: ['', Validators.required],
    isActive: ['', Validators.required]
  });

  formRegion = this.formBuilder.group({
    regionName: ['', Validators.required],
    isCity: ['', Validators.required]
  });

  formEducation = this.formBuilder.group({
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
    this.fParent.username.setValue(user.username);
    this.fParent.password.setValue(user.password);
    this.fParent.email.setValue(user.email);
    this.fParent.birthdate.setValue(user.birthDate);
    this.fParent.isActive.setValue(user.isActive);
  }

  deleteUser(userId) {
    this.users = this.users.filter(element => element.id != userId);
  }

  editAdmin(adminId) {  
    this.isAddMode = false;
    var admin = this.admins.find(admin => admin.id === adminId);
    this.fAdmin.username.setValue(admin.username);
    this.fAdmin.password.setValue(admin.password);
  }

  deleteAdmin(adminId) {
    this.admins = this.admins.filter(element => element.id != adminId);
  }

  editRegion(regionId) {  
    this.isAddMode = false;
    var region = this.regions.find(region => region.id === regionId);
    this.fRegion.regionName.setValue(region.regionName);
    this.fRegion.isCity.setValue(region.isCity);
  }

  deleteRegion(regionId) {
    this.regions = this.regions.filter(element => element.id != regionId);
  }

  editEducation(educationId) {  
    this.isAddMode = false;
    var education = this.educations.find(user => user.id === educationId);
    this.fEducation.educationDegree.setValue(education.educationDegree);
  }

  deleteEducation(educationId) {
    this.educations = this.educations.filter(element => element.id != educationId);
  }


  onSubmitChild() {

    this.alertService.clear();

    if (this.formChild.invalid) {
        return;
    }

    this.loading = true;
    if(this.isAddMode){
      this.adminService.addChild(this.formChild.value)
        .pipe(first())
        .subscribe( 
          data => {
            var child = Object.assign(new Child(), data);
            this.children.push(child);
          },
          error => {
            this.alertService.error(error);
            this.loading = false;
          });
    }
    else {
      this.adminService.updateChild(this.formChild.value)
        .pipe(first())
        .subscribe( 
          data => {
            var child = Object.assign(new Child(), data);
            this.children = this.children.filter(element => element.id != child.id);
            this.children.push(child);
            this.children.sort();
          },
          error => {
            this.alertService.error(error);
            this.loading = false;
          });
        }
  }

  onSubmitParent() {
    this.alertService.clear();

    if (this.formParent.invalid) {
        return;
    }

    this.loading = true;
    if(this.isAddMode){
      this.adminService.addParent(this.formParent.value)
        .pipe(first())
        .subscribe( 
          data => {
            var parent = Object.assign(new User(), data);
            this.users.push(parent);
          },
          error => {
            this.alertService.error(error);
            this.loading = false;
          });
    }
    else {
      this.adminService.updateParent(this.formParent.value)
        .pipe(first())
        .subscribe( 
          data => {
            var parent = Object.assign(new User(), data);
            this.users = this.users.filter(element => element.id != parent.id);
            this.users.push(parent);
            this.users.sort();
          },
          error => {
            this.alertService.error(error);
            this.loading = false;
          });
        }
  }

  onSubmitRegion() {

    this.alertService.clear();

    if (this.formRegion.invalid) {
        return;
    }

    this.loading = true;
    if(this.isAddMode){
      this.adminService.addRegion(this.formRegion.value)
        .pipe(first())
        .subscribe( 
          data => {
            var region = Object.assign(new Region(), data);
            this.regions.push(region);
          },
          error => {
            this.alertService.error(error);
            this.loading = false;
          });
    }
    else {
      this.adminService.updateRegion(this.formRegion.value)
        .pipe(first())
        .subscribe( 
          data => {
            var region = Object.assign(new Region(), data);
            this.regions = this.regions.filter(element => element.id != region.id);
            this.regions.push(region);
            this.regions.sort();
          },
          error => {
            this.alertService.error(error);
            this.loading = false;
          });
        }
  }

  onSubmitEducation() {

    this.alertService.clear();

    if (this.formEducation.invalid) {
        return;
    }

    this.loading = true;
    if(this.isAddMode){
      this.adminService.addEducation(this.formEducation.value)
        .pipe(first())
        .subscribe( 
          data => {
            var education = Object.assign(new Education(), data);
            this.educations.push(education);
          },
          error => {
            this.alertService.error(error);
            this.loading = false;
          });
    }
    else {
      this.adminService.updateEducation(this.formEducation.value)
        .pipe(first())
        .subscribe( 
          data => {
            var education = Object.assign(new Education(), data);
            this.educations = this.educations.filter(element => element.id != education.id);
            this.educations.push(education);
            this.educations.sort();
          },
          error => {
            this.alertService.error(error);
            this.loading = false;
          });
        }
  }

  onSubmitAdmin() {
    this.alertService.clear();

    if (this.formAdmin.invalid) {
        return;
    }

    this.loading = true;
    if(this.isAddMode){
      this.adminService.addAdmin(this.formAdmin.value)
        .pipe(first())
        .subscribe( 
          data => {
            var admin = Object.assign(new Admin(), data);
            this.admins.push(admin);
          },
          error => {
            this.alertService.error(error);
            this.loading = false;
          });
    }
    else {
      this.adminService.updateAdmin(this.formEducation.value)
        .pipe(first())
        .subscribe( 
          data => {
            var admin = Object.assign(new Admin(), data);
            this.admins = this.admins.filter(element => element.id != admin.id);
            this.admins.push(admin);
            this.admins.sort();
          },
          error => {
            this.alertService.error(error);
            this.loading = false;
          });
        }
  }

}
