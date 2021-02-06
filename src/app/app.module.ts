import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; 
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { RegisterComponent } from './components/register-unused/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterMockComponent } from './components/register/register.component';
import { ErrorInterceptor, fakeBackendProvider, JwtInterceptor } from './_helpers';

import { AlertComponent } from '@app/_alerts';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule} from '@angular/material/select';
import { AdminComponent } from './admin/admin.component';
import { ProfileComponent } from './profile/profile.component';

@NgModule({
  declarations: [AppComponent, HomePageComponent, RegisterComponent, DashboardComponent, LoginComponent, RegisterMockComponent, AlertComponent, StatisticsComponent, AdminComponent, ProfileComponent],
  imports: [BrowserModule, FormsModule, HttpClientModule, AppRoutingModule, ReactiveFormsModule, BrowserAnimationsModule, MatTabsModule, MatSelectModule],
  providers: [ { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

    // provider used to create fake backend
    fakeBackendProvider],
  bootstrap: [AppComponent],
})
export class AppModule {}

