import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { AuthService } from 'aurelia-auth';
import { Users } from '../resources/data/users';


import {
  ValidationControllerFactory,
  ValidationController,
  ValidationRules
} from 'aurelia-validation';

import {BootstrapFormRenderer} from '../resources/utils/bootstrap-form-renderer';

@inject(Router, AuthService, Users, ValidationControllerFactory)
export class Home {

  constructor(router, auth, users) {
    this.router = router;
    this.auth = auth;
    this.users = users;

    this.message = 'Todo';
    this.showLogin = true;

    this.email;
    this.password;
    this.firstName;
    this.lastName;
    this.screenName;

    this.loginError = '';
    this.registerError ='';



  }


  login() {
    return this.auth.login(this.email, this.password)
      .then(response => {
        sessionStorage.setItem("user", JSON.stringify(response.user));
        this.loginError = "";
        this.router.navigate('wall');
      })
      .catch(error => {
        console.log(error);
        this.loginError = "Invalid credentials.";
      });
  };


  logout() {
    sessionStorage.removeItem('user');
    this.auth.logout();

  }

  async save() {
    var user = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      screenName: this.screenName,
      password: this.password
    }
    let serverResponse = await this.users.save(user);
    if(!serverResponse.error){
       this.registerError = "";
      this.showLogin = true;
    } else {
      this.registerError = "There was a problem registering the user."
    }
 }


  showRegister() {
    this.showLogin = !this.showLogin;
    this.registerError = "";
    this.loginError ="";
  }



  back() {
    this.showLogin = !this.showLogin;
  }



}
