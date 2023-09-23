import { Component } from '@angular/core';
import { AuthService } from "../services/auth.service";
import {provideRouter, Router} from "@angular/router";
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from "@angular/fire/compat/firestore";
import {first} from "rxjs";
import {Firestore} from "@angular/fire/firestore";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  userName: string = "null"
  userCollection?: AngularFirestoreDocument<any>;
  constructor(public db: AngularFirestore,public authService: AuthService, public router: Router) {
    if(authService.isLoggedIn){
      let userInfo = JSON.parse(localStorage.getItem('user')!);
      this.userCollection = this.db.doc(`users/${userInfo.uid}`)
      this.userCollection.valueChanges().pipe(first()).subscribe( (user: any) =>{
        //console.log(user.name)
        this.userName = user.name
      })
    }
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

  NavigateDashboard() {
    this.router.navigate([`dashboard`])
  }
}
