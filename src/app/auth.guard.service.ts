import {AuthService} from "./services/auth.service";
import {inject} from "@angular/core";
import {Router} from "@angular/router";

export const authGuard = () => {
  const userService = inject(AuthService)
  const router = inject(Router)
  if(userService.isLoggedIn !== true){
    window.alert('Brak dostępu');
    router.navigate(['login']);
    return false;
  }else{
    return true;
  }
}

export const userLogged = () => {
  const userService = inject(AuthService)
  const router = inject(Router)
  if(userService.isLoggedIn === true){
    router.navigate(['dashboard']);
    return false;
  }else{
    return true;
  }
}
