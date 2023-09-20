import { Component } from '@angular/core';
import { AuthService } from "../services/auth.service";
import {provideRouter, Router} from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  constructor(public authService: AuthService, public router: Router) {
  }

  LogOut(){
    this.authService.SignOut()
  }
  NavigateLogin(){
    this.router.navigate(['login'])
  }
  NavigateRegister(){
    this.router.navigate(['register'])
  }
  NavigateUserPanel(){
    this.router.navigate(['account-edit'])
  }
}
