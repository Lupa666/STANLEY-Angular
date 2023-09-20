import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import {authGuard, userLogged} from "./auth.guard.service";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {ConfirmEmailComponent} from "./confirm-email/confirm-email.component";
import {ForgotPasswordComponent} from "./forgot-password/forgot-password.component";
import {AccountEditComponent} from "./account-edit/account-edit.component";
import {CourseMainComponent} from "./course-main/course-main.component";
import {QuizComponent} from "./quiz/quiz.component";

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full'},
  { path: 'login', component: LoginComponent, canActivate: [userLogged] },
  { path: 'register', component: RegisterComponent, canActivate: [userLogged] },
  { path: 'mail-confirm', component: ConfirmEmailComponent, canActivate: [userLogged]},
  { path: 'password-recovery', component: ForgotPasswordComponent, canActivate: [userLogged]},
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard]},
  { path: 'account-edit', component: AccountEditComponent, canActivate: [authGuard]},
  { path: 'course-main', component: CourseMainComponent, canActivate: [authGuard]},
  { path: 'account-edit', component: AccountEditComponent, canActivate: [authGuard]},
  { path: 'quiz', component: QuizComponent, canActivate: [authGuard]},
  { path: 'forgot-password', component: ForgotPasswordComponent, canActivate: [authGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
