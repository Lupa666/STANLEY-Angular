import { Component } from '@angular/core';
import {AuthService, Credentials} from "../services/auth.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  email: string = "";
  name: string = "";
  surname: string ="";
  password: string = "";

  constructor(public authService: AuthService){}
  register(){
    let registerCred: Credentials = {
      email: this.email,
      password: this.password
    }
    this.authService.SignUp(registerCred)
  }

}
