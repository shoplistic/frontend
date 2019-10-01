import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '@service/auth.service';
import { Router } from '@angular/router';
import { UserLogin } from '@class/user-login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements AfterViewInit {

  @ViewChild('af', { static: true }) af: ElementRef;

  submitted = false;
  loginData = new UserLogin('', '');
  error = '';

  constructor(private _auth: AuthService, private _router: Router) {

    if (this._auth.loggedIn()) {
      this._router.navigate(['/']);
    }

  }

  ngAfterViewInit() {
    this.af.nativeElement.focus();
  }

  onSubmit() {
    this.submitted = true;
    this.error = '';

    this._auth.login(this.loginData)
      .subscribe(
        res => {
          localStorage.setItem('token', res.bearer);
          this._router.navigate(['/']);
          if (res.admin) {
            localStorage.setItem('admin', 'true');
          }
        },
        err => {
          this.submitted = false;
          // if (err.status === 401) {
          //   this.error = 'Invalid credentials';
          // } else {
          //   // this.error = err.error.message ? err.error.message : err.message;
          // }
          if (err.status === 0) {
            this.error = 'Could not reach server, please check your connection and try again';
          } else if (err.status === 401) {
            this.error = 'Invalid credentials';
          } else {
            this.error = err.statusText;
          }
        }
      );


  }

}
