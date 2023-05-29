import { Component } from '@angular/core';
import {AuthService, Credentials} from "../services/auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(public authService: AuthService) {
  }
  login() {
    let loginCred: Credentials = {
      email: this.email,
      password: this.password
    }
    this.authService.SignIn(loginCred)
  }
  passwordRecoveryRoute() {
    console.log('Password recovery');
    //TODO password recovery page
  }
}
