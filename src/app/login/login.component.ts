import { CommonModule, Location } from '@angular/common';
import { Component, HostListener, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { LogoAnimationComponent } from '../logo-animation/logo-animation.component';
import { UserdataService } from '../services/userdata.service';
import { RouterModule, Router } from '@angular/router';
import { Guest } from '../shared/models/guestUser.model';
import {
  Firestore,
  collectionData,
  collection,
  doc,
  onSnapshot,
  addDoc,
  QuerySnapshot,
  DocumentData,
  getDoc,
  query,
  getDocs,
  where,
} from '@angular/fire/firestore';
import { LogoAnimationMobileComponent } from '../logo-animation-mobile/logo-animation-mobile.component';
import { PopupNotificationComponent } from '../shared/modules/popup-notification/popup-notification.component';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    LogoAnimationComponent,
    LogoAnimationMobileComponent,
    RouterModule,
    PopupNotificationComponent,
  ],
})
export class LoginComponent {
  checkbox: boolean = false;
  checkboxColor: string = '#2a3647';
  userform: FormGroup;
  mobileMode = false;
  savedUsers = [];
  firestore: Firestore = inject(Firestore);
  currentEmail: string | null | undefined = undefined;
  currentPassword: string | null | undefined = undefined;
  showNotification = false;
  notificationText = '';

  constructor(
    public userService: UserdataService,
    private router: Router,
    private location: Location
  ) {
    this.userform = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit() {
    this.checkMobile();
    this.currentEmail = localStorage.getItem('email');
    this.currentPassword = localStorage.getItem('password');
    if (this.currentPassword && this.currentEmail) {
      this.userform.controls['email'].setValue(this.currentEmail);
      this.userform.controls['password'].setValue(this.currentPassword);
    }
  }

  /**
   * When user login submit with correct parameters and "remember me" checkbox is checked,
   * the parameters will be saved in the localstorage.
   * @param email email from input field
   * @param password password from input field
   */
  rememberMe(email: string, password: string) {
    if (this.checkbox) {
      localStorage.setItem('email', email);
      localStorage.setItem('password', password);
    }
  }

  /**
   * Routerlink to signup page.
   */
  linkToSignUp() {
    this.router.navigate(['signup/']);
  }

  /**
   * When form field is submitted, a database query check the user and get the docId.
   * Route to summary page
   */
  async onSubmit() {
    let email = this.userform.controls['email'].value;
    let password = this.userform.controls['password'].value;
    const q = query(
      collection(this.firestore, 'users'),
      where('email', '==', email),
      where('password', '==', password)
    );
    let docId = undefined;
    let data;

    let snapshot = await getDocs(q);
    snapshot.forEach((doc) => {
      docId = doc.id;
      data = doc.data();
    });

    if (docId) {
      this.router.navigate(['summary/' + docId]);
      this.userService.saveIdInSessionStorage(docId);
      this.rememberMe(email, password);
    } else this.wrongLogin();
  }

  /**
   * User not found in database, cannot be logged in. Show notification.
   */
  wrongLogin() {
    this.notificationText = 'Email or password not correct. Login failed.';
    this.showNotification = true;
    this.clearForm();
    setTimeout(() => {
      this.showNotification = false;
    }, 2500);
  }

  /**
   * Reset the form.
   */
  clearForm() {
    this.userform.reset();
  }

  /**
   * Login as guest user. Creates a new instance in database and redirect to summary.
   */
  async addNewGuestUser() {
    let guest = new Guest('guest', 'demo@mail.com', 'G', '123456');
    guest.userinitials = 'G';

    const docRef = await addDoc(
      this.userService.getUserRef(),
      guest.toJSON()
    ).then((docInfo) => {
      this.router.navigate(['summary/' + docInfo.id]);
      this.userService.saveIdInSessionStorage(docInfo.id);
      this.userService.saveDataInSessionStorage('name', 'guest');
    });
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.checkMobile();
  }

  /**
   * Check if page is in mobile mode.
   */
  checkMobile() {
    let width = window.innerWidth;
    this.mobileMode = width <= 680 ? true : false;
  }

  /**
   * Converts the username to its initials. Max 2 letters
   * @param name username
   * @returns initials of the username with max 2 letters
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

  /**
   * Update the status of the checkbox
   * @param completed MatCheckbox event
   */
  updateCheckbox(completed: boolean) {
    this.checkbox = completed;
  }

  linkToLegalNotice() {
    this.router.navigate(['legal-notice-blank']);
  }
  linkToPrivacyPolicy() {
    this.router.navigate(['privacy-policy-blank']);
  }
}
