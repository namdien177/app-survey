import { Component, OnInit } from '@angular/core';
import { DataControlService } from 'src/services/data-control.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  constructor(
    private dataDB: DataControlService,
    private router: Router
  ) { }

  username: string = '';
  password: string = '';

  errMessage = "";

  ngOnInit() {
  }

  login() {
    if (this.username.length > 0 && this.password.length > 0) {
      this.errMessage = '';
      this.dataDB.login(this.username, this.password).then(
        res => {
          console.log(res);
          if (res) {
            this.router.navigateByUrl('/home');
          }else{
            this.errMessage = "Username or Password was incorrect!"
          }
        }
      )
    }else{
      this.errMessage = 'Username and Password is required!';
    }
  }

}
