import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { passwordMatchValidator } from '../shared/passwordValid.directive';
import { Router, RouterModule } from '@angular/router';
import { User } from '../interfaces/user.interface';
import { PopupNotificationComponent } from '../shared/modules/popup-notification/popup-notification.component';
import { SessiondataService } from '../services/sessiondata.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCheckboxModule,
    FormsModule,
    CommonModule,
    RouterModule,
    PopupNotificationComponent,
    HttpClientModule,
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent {
  checkbox: boolean = false;
  newUserForm: FormGroup;
  user: User = {
    name: '',
    email: '',
    userinitials: '',
    password: '',
    contacts: [],
    tasks: [],
  };
  showNotification = false;
  notificationText = '';

  constructor(
    private router: Router,
    private sessionDataService: SessiondataService
  ) {
    this.newUserForm = new FormGroup(
      {
        name: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required, Validators.email]),
        password_1: new FormControl('', [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(10),
        ]),
        password_2: new FormControl('', [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(10),
        ]),
      },
      { validators: passwordMatchValidator }
    );
  }

  /**
   * If submit button is pressed, check database if user exists.
   * If not, add new user, otherwise show notification text.
   */
  async onSubmit() {
    let name = this.newUserForm.get('name')?.value;
    let email = this.newUserForm.get('email')?.value;
    let password = this.newUserForm.get('password_1')?.value;
    try {
      let resp = await this.sessionDataService.registerNewUserAPI(
        email,
        password,
        name
      );
      this.notificationText = 'You Signed Up successfully';
      this.showNotification = true;
      this.clearForm();
      setTimeout(() => {
        this.router.navigate(['']);
      }, 2500);
    } catch (e) {
      this.notificationText = 'This email is already registered';
      this.showNotification = true;
      this.clearForm();
      setTimeout(() => {
        this.showNotification = false;
      }, 4500);
    }
  }

  /**
   * Reset the form
   */
  clearForm() {
    this.newUserForm.patchValue({
      name: '',
      email: '',
      password_1: '',
      password_2: '',
    });
    this.newUserForm.markAsPristine();
    this.newUserForm.markAsUntouched();
    this.checkbox = false;
  }

  /**
   * Convert the username into its initials.
   * @param name username
   * @returns initials
   */
  getInitials(name: string) {
    let splitName = name.split(' ', 2);

    let name_1 =
      typeof splitName[0].charAt(0) == 'string'
        ? splitName[0].charAt(0).toUpperCase()
        : '';
    let name_2 =
      typeof splitName[1]?.charAt(0) == 'string'
        ? splitName[1].charAt(0).toUpperCase()
        : '';

    return name_1 + name_2;
  }

  linkToPrivacyPolicy() {
    this.router.navigate(['privacy-policy-blank']);
  }

  linkToLegalNotice() {
    this.router.navigate(['legal-notice-blank']);
  }
}
