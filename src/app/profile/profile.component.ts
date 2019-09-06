import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ProfileService } from '../_services/profile.service';
import { UserData, PasswordReset } from '../_classes/user-data';
import { InfoBarService } from '../_services/info-bar.service';
import { AuthService } from '../_services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  @ViewChild('deleteModal', { static: true }) deleteModal: ElementRef;

  userData = new UserData('', 0);
  regDate = '';

  passwordReset = new PasswordReset('', '', '');
  submitted = false;

  constructor(
    private _profileService: ProfileService,
    private _infobarService: InfoBarService,
    private _authService: AuthService,
    private _router: Router
  ) { }

  ngOnInit() {

    this._profileService.get().subscribe(
      res => {
        this.userData = res;
        this.regDate = new Date(res.registerDate).toLocaleString();
      },
      _err => {
        // console.error(err);
        this._infobarService.show('Error fetching data', 3000);
      }
    );

  }

  prSubmit() {

    this.submitted = true;

    this._profileService.resetPassword(this.passwordReset).subscribe(
      _res => {
        this._infobarService.show('Password updated', 3000);
        // this.passwordReset = new PasswordReset('', '', '');
        // this.submitted = false;
      },
      _err => {
        this._infobarService.show('Invalid password', 3000);
        this.passwordReset.old_password = '';
        this.submitted = false;
      }
    );

  }

  deleteProfileSubmit() {

    this._profileService.deleteAccount().subscribe(
      _res => {
        this._authService.logOut();
        this._router.navigate(['/login']);
      },
      _err => {
        this._infobarService.show('An error occurred', 5000);
        this.toggleDeleteModal();
      }
    );

  }

  toggleDeleteModal() {

    this.deleteModal.nativeElement.classList.toggle('show');

  }

}
