import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { Router } from '@angular/router';
import { UserRegister } from '../_classes/user-register';
import { environment } from '../../environments/environment';
import { RecaptchaComponent } from 'ng-recaptcha';
import { UserLogin } from '../_classes/user-login';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements AfterViewInit {

  @ViewChild('af') af: ElementRef;
  @ViewChild('re') re: RecaptchaComponent;

  siteKey = environment.siteKey;

  submitted = false;
  registerData = new UserRegister('', '', '', '');
  error = '';
  ok = '';

  constructor(private _auth: AuthService, private _router: Router) {
    if (this._auth.loggedIn()) {
      this._router.navigate(['/']);
    }
  }

  ngAfterViewInit() {
    this.af.nativeElement.focus();
  }

  login() {

    if (this.registerData.username && this.registerData.password) {

      this._auth.login(this.registerData as UserLogin).subscribe(
        res => {
          localStorage.setItem('token', res.bearer);
          this._router.navigate(['/']);
          if (res.admin) {
            localStorage.setItem('admin', 'true');
          }
        },
        err => {
          this.error = err.error.message ? err.error.message : err.message;
        }
      );

    } else {

      // Redirect to login page.
      this._router.navigate(['/login']);

    }

  }

  register() {

    this.submitted = true;
    this.error = '';

    this._auth.register(this.registerData)
      .subscribe(
        _res => {
          this.ok = 'Account created! Click the login button to proceed.';
        },
        err => {
          this.submitted = false;

          if (err.status === 409) {
            this.error = 'Username is already taken';
          } else {
            this.error = err.error.message ? err.error.message : err.message;
          }
        }
      );

  }

}
