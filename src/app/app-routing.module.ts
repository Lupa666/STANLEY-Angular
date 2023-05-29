import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import {authGuard, userLogged} from "./auth.guard.service";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {ConfirmEmailComponent} from "./confirm-email/confirm-email.component";
import {ForgotPasswordComponent} from "./forgot-password/forgot-password.component";

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full'},
  { path: 'login', component: LoginComponent, canActivate: [userLogged] },
  { path: 'register', component: RegisterComponent, canActivate: [userLogged] },
  { path: 'mail-confirm', component: ConfirmEmailComponent, canActivate: [userLogged]},
  { path: 'password-recovery', component: ForgotPasswordComponent, canActivate: [userLogged]},
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
