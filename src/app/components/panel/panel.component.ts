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

  region: Region = null;
  admin: Admin = null;
  child: Child = null;
  user: User = null;
  education: Education = null;

  loading = false;

  submittedParent = false;
  submittedChild = false;
  submittedRegion = false;
  submittedEducation = false;
  submittedAdmin = false;

  isAddMode = true;

  formChild = this.formBuilder.group({
    parentID: ['', Validators.required],
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
    email: ['', Validators.required, Validators.email],
    birthdate: ['', Validators.required],
    isActive: [false, Validators.required]
  });

  formRegion = this.formBuilder.group({
    regionName: ['', Validators.required],
    isCity: [false, Validators.required]
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
    let admin = JSON.parse(localStorage.getItem('admin'));
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
    this.adminService.getAdministrators(admin.id)
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

  banOrUnbanUser(user: User) {
    this.adminService.banOrUnbanUser(user.id)
      .pipe(first())
      .subscribe(data => {
        user.isBanned = !user.isBanned
      })
  }

  editChild(childId) {  
    this.isAddMode = false;
    this.child = this.children.find(child => child.id === childId);
    this.fChild.parentID.setValue(this.child.parentId);
    this.fChild.name.setValue(this.child.name);
    this.fChild.education.setValue(this.child.education.educationDegree);
    this.fChild.region.setValue(this.child.region.regionName);
    this.fChild.plannedAmount.setValue(this.child.plannedAmount);
    this.fChild.actualAmount.setValue(this.child.actualAmount);
  }

  deleteChild(childId) {
    this.adminService.deleteChild(childId)
        .pipe(first())
        .subscribe( 
          data => {
            this.children = this.children.filter(element => element.id != childId);
            this.loading = false;
          },
          error => {
            this.loading = false;
          });
  }

  editUser(userId) {  
    this.isAddMode = false;
    this.user = this.users.find(user => user.id === userId);
    this.fParent.username.setValue(this.user.username);
    this.fParent.password.setValue(this.user.password);
    this.fParent.email.setValue(this.user.email);
    this.fParent.birthdate.setValue(this.user.birthDate);
    this.fParent.isActive.setValue(this.user.isActive);
  }

  deleteUser(userId) {
    this.adminService.deleteParent(userId)
        .pipe(first())
        .subscribe( 
          data => {
            this.users = this.users.filter(element => element.id != userId);
            this.loading = false;
          },
          error => {
            this.loading = false;
          });
  }

  editAdmin(adminId) {  
    this.isAddMode = false;
    this.admin = this.admins.find(admin => admin.id === adminId);
    this.fAdmin.username.setValue(this.admin.username);
    this.fAdmin.password.setValue(this.admin.password);
  }

  deleteAdmin(adminId) {
    this.adminService.deleteAdmin(adminId)
        .pipe(first())
        .subscribe( 
          data => {
            this.admins = this.admins.filter(element => element.id != adminId);
            this.loading = false;
          },
          error => {
            this.loading = false;
          });
  }

  editRegion(regionId) {  
    this.isAddMode = false;
    this.region = this.regions.find(region => region.id === regionId);
    this.fRegion.regionName.setValue(this.region.regionName);
    this.fRegion.isCity.setValue(this.region.isCity);
  }

  deleteRegion(regionId) {
    this.adminService.deleteRegion(regionId)
    .pipe(first())
    .subscribe( 
      data => {
        this.regions = this.regions.filter(element => element.id != regionId);
        this.loading = false;
      },
      error => {
        this.loading = false;
      });
  }

  editEducation(educationId) {  
    this.isAddMode = false;
    this.education = this.educations.find(user => user.id === educationId);
    this.fEducation.educationDegree.setValue(this.education.educationDegree);
  }

  deleteEducation(educationId) {
    this.adminService.deleteEducation(educationId)
    .pipe(first())
    .subscribe( 
      data => {
        this.educations = this.educations.filter(element => element.id != educationId);
        this.loading = false;
      },
      error => {
        this.loading = false;
      });
  }


  onSubmitChild() {
    this.submittedChild = true;
    this.alertService.clear();

    if (this.formChild.invalid) {
        return;
    }

    if(this.fChild.actualAmount.value == ''){
      this.fChild.actualAmount.setValue(-1);
    }

    this.loading = true;
    if(this.isAddMode){
      this.adminService.addChild(this.formChild.value)
        .pipe(first())
        .subscribe( 
          data => {
            var child = Object.assign(new Child(), data);
            this.children.push(child);
            this.loading = false;
            this.submittedChild = false;
          },
          error => {
            this.loading = false;
          });
    }
    else {
      this.adminService.updateChild(this.formChild.value, this.child.id)
        .pipe(first())
        .subscribe( 
          data => {
            var child = Object.assign(new Child(), data);
            this.children = this.children.filter(element => element.id != child.id);
            this.children.push(child);
            this.children.sort();
            this.changeModeChildren();
            this.loading = false;
            this.submittedChild = false;
          },
          error => {
            this.loading = false;
          });
        }
  }

  onSubmitParent() {
    this.submittedParent = true;
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
            this.loading = false;
            this.submittedParent = false;
          },
          error => {
            this.loading = false;
          });
    }
    else {
      this.adminService.updateParent(this.formParent.value, this.user.id)
        .pipe(first())
        .subscribe( 
          data => {
            var parent = Object.assign(new User(), data);
            this.users = this.users.filter(element => element.id != parent.id);
            this.users.push(parent);
            this.users.sort();
            this.changeModeParents();
            this.loading = false;
            this.submittedParent = false;
          },
          error => {
            this.loading = false;
          });
        }
  }

  onSubmitRegion() {
    this.submittedRegion = true;
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
            this.loading = false;
            this.submittedRegion = false;
          },
          error => {
            this.loading = false;
          });
    }
    else {
      this.adminService.updateRegion(this.formRegion.value, this.region.id)
        .pipe(first())
        .subscribe( 
          data => {
            var region = Object.assign(new Region(), data);
            this.regions = this.regions.filter(element => element.id != region.id);
            this.regions.push(region);
            this.regions.sort();
            this.changeModeRegions();
            this.loading = false;
            this.submittedRegion = false;
          },
          error => {
            this.loading = false;
          });
        }
  }

  onSubmitEducation() {
    this.submittedEducation = true;
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
            this.loading = false;
            this.submittedEducation = false;
          },
          error => {
            this.loading = false;
          });
    }
    else {
      this.adminService.updateEducation(this.formEducation.value, this.education.id)
        .pipe(first())
        .subscribe( 
          data => {
            var education = Object.assign(new Education(), data);
            this.educations = this.educations.filter(element => element.id != education.id);
            this.educations.push(education);
            this.educations.sort();
            this.changeModeEducations();
            this.loading = false;
            this.submittedEducation = false;
          },
          error => {
            this.loading = false;
          });
        }
  }

  onSubmitAdmin() {
    this.submittedAdmin = true;
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
            this.loading = false;
            this.submittedAdmin = false;
          },
          error => {
            this.loading = false;
          });
    }
    else {
      this.adminService.updateAdmin(this.formAdmin.value, this.admin.id)
        .pipe(first())
        .subscribe( 
          data => {
            var admin = Object.assign(new Admin(), data);
            this.admins = this.admins.filter(element => element.id != admin.id);
            this.admins.push(admin);
            this.admins.sort();
            this.changeModeAdmins();
            this.loading = false;
            this.submittedAdmin = false;
          },
          error => {
            this.loading = false;
          });
        }
  }

  changeModeParents() {
    this.isAddMode = true;
    this.user = null;
    this.fParent.username.setValue('');
    this.fParent.password.setValue('');
    this.fParent.email.setValue('');
    this.fParent.birthdate.setValue('');
    this.fParent.isActive.setValue(false);
  }

  changeModeAdmins() {
    this.isAddMode = true;
    this.admin = null;
    this.fAdmin.username.setValue('');
    this.fAdmin.password.setValue('');
  }

  changeModeChildren() {
    this.isAddMode = true;
    this.child = null;
    this.fChild.parentID.setValue('');
    this.fChild.name.setValue('');
    this.fChild.education.setValue('');
    this.fChild.region.setValue('');
    this.fChild.plannedAmount.setValue('');
    this.fChild.actualAmount.setValue('');
  }

  changeModeRegions() {
    this.isAddMode = true;
    this.region = null;
    this.fRegion.regionName.setValue('');
    this.fRegion.isCity.setValue(false);
  }

  changeModeEducations() {
    this.isAddMode = true;
    this.education = null;
    this.fEducation.educationDegree.setValue('');
  }

  onTabChanged(event) {
    this.changeModeAdmins();
    this.changeModeChildren();
    this.changeModeParents();
    this.changeModeEducations();
    this.changeModeParents();
  }

}
