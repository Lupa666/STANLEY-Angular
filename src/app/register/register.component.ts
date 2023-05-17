import { Component } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  email: String = "";
  name: String = "";
  surname: String ="";
  password: String = "";

  register(){
    console.log("Email: " + this.email )
    console.log("Imię: " + this.name )
    console.log("Nazwisko: " + this.surname)
    console.log("Hasło: " + this.password )
  }

}
