import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterMockComponent } from './components/register/register.component';
import { RegisterComponent } from './components/register-unused/register.component';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { AuthGuard } from './_helpers';

// const accountModule = () => import('@app/components/register-mock/account.module').then(x => x.AccountModule);
const usersModule = () => import('@app/components/childs/users.module').then(x => x.UsersModule);

const routes: Routes = [
{ path: '', redirectTo: '/home', pathMatch: 'full' },
{ path: 'home', component: HomePageComponent },
{ path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
{ path: 'login', component: LoginComponent },
{ path: 'register', component: RegisterMockComponent },
{ path: 'children', loadChildren: usersModule, canActivate: [AuthGuard] },
{ path: 'statistics', component: StatisticsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
