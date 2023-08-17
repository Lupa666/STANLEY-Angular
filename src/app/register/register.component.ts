import { Component } from '@angular/core';
import {AuthService, Credentials} from "../services/auth.service";
import {User} from "../model/user";

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
      password: this.password,
    }
    let userInfo = {
      name: this.name,
      surname: this.surname
    }
    this.authService.SignUp(registerCred, userInfo)
  }

}
