import { Component } from '@angular/core';
import {first} from "rxjs";
import {AngularFirestore, AngularFirestoreDocument} from "@angular/fire/compat/firestore";
import {AuthService} from "../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-account-edit',
  templateUrl: './account-edit.component.html',
  styleUrls: ['./account-edit.component.css']
})
export class AccountEditComponent {
  private userCollection?: AngularFirestoreDocument<any>;
  public userFullName: string = "null"
  public userEmail: string = "null"
  public userContact: string = "null"

  constructor(public db: AngularFirestore,public router: Router) {
    let userInfo = JSON.parse(localStorage.getItem('user')!);
    this.userCollection = this.db.doc(`users/${userInfo.uid}`)
    this.userCollection.valueChanges().pipe(first()).subscribe( (user: any) =>{
      //console.log(user.name)
      this.userFullName = user.name + " " + user.surname
      this.userEmail = user.email
      this.userContact = user.email
    })
  }
}
