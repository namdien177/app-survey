import { Component, OnInit } from '@angular/core';
import { DataControlService } from 'src/services/data-control.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {

  constructor(
    private db: DataControlService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  username: string = '';
  password: string = '';
  confPassword: string = '';
  errorText: string = '';

  register() {
    let usernameValidated = this.checkUsername();
    let passwordValidated = this.checkPassword();

    if (!usernameValidated) {
      this.errorText = "You entered a wrong email!";
      return false;
    }

    if (!passwordValidated.status) {
      this.errorText = passwordValidated.message;
      return false;
    }
    this.errorText = '';

    this.db.register(this.username, this.password).then(
      res => {
        if (res) {
          this.router.navigateByUrl('/login');
        } else {
          this.errorText = "Unable to register, please try again";
        }
      }
    )
  }

  checkPassword(): { status: boolean; message: string } {
    if (this.password.length < 3) {
      return {
        status: false,
        message: 'Password length requires at least 4 characters'
      };
    }

    if (this.password != this.confPassword) {
      return {
        status: false,
        message: 'Confirm password does not match the password field'
      };
    }

    return {
      status: true,
      message: 'Pass'
    }
  }

  checkUsername() {
    return this.validateEmail(this.username);
  }

  private validateEmail(email) {
    var re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    return re.test(String(email).toLowerCase());
  }

}
