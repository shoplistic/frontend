import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { Router } from '@angular/router';
import { UserLogin } from '../_classes/user-login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements AfterViewInit {

  @ViewChild('af') af: ElementRef;

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
          console.log(err);
          this.submitted = false;
          if (err.status === 401) {
            this.error = 'Invalid credentials';
          } else {
            // this.error = err.error.message ? err.error.message : err.message;
          }
        }
      );


  }

}
