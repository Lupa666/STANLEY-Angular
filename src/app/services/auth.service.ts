import { Injectable } from '@angular/core';
import {Router} from "@angular/router";

import {AngularFireAuth} from "@angular/fire/compat/auth";
import {AngularFirestore, AngularFirestoreDocument} from "@angular/fire/compat/firestore";
import {Observable, of} from "rxjs";
import {switchMap} from "rxjs";
import {User} from "../model/user";
import {user} from "@angular/fire/auth";

export interface Credentials{
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<User | null | undefined>;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
  ) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
        if(user){
          return this.afs.doc<User>('users/${user.uid}').valueChanges();
        }else{
          return of(null);
        }
      })
    )

  }

  async signIn({email, password}: Credentials){

  }
}
