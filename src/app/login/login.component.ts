import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  login() {
    // Perform login logic here
    console.log('Email:', this.email);
    console.log('Password:', this.password);
    // You can send an HTTP request to authenticate the user
    // and handle the response accordingly
  }
  passwordRecoveryRoute() {
    console.log('Password recovery');
    //TODO password recovery page
  }
}
