import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserdataService } from '../../../services/userdata.service';
import { ClickOutsideMenuDirective } from '../../click-outside-menu.directive';
import { CommonModule } from '@angular/common';
import { SessiondataService } from '../../../services/sessiondata.service';
import { User } from '../../../interfaces/user.interface';
import { AppComponent } from '../../../app.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ClickOutsideMenuDirective, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  docId = '';
  initials = '';
  showMenu = false;
  _subscriptionUser: any;
  localUser: User = {
    id: '',
    name: '',
    userinitials: '',
    email: '',
    password: '',
    contacts: [],
    tasks: [],
  };
  constructor(
    private userService: UserdataService,
    private router: Router,
    private sessionDataService: SessiondataService
  ) {
    this.docId = this.userService.loadIdFromSessionStorage();
  }

  ngOnInit(){
    this._subscriptionUser = this.sessionDataService.userSubject.subscribe(
      (user: User) => {
        this.localUser = user;

      }
    );
  }

  ngOnDestroy() {
    this._subscriptionUser.unsubscribe();
  }

  linkToHelp() {
    this.router.navigate(['help']);
  }
  linkToLegalNotice() {
    this.router.navigate(['legal-notice']);
  }
  linkToPrivacyPolicy() {
    this.router.navigate(['privacy-policy']);
  }

  linkToStartPage() {
    this.router.navigate(['']);
  }

  logOut() {
    this.linkToStartPage();
    this.userService.deleteDataInSessionStorage('userId');
    location.replace("/");
  }

  openMenu() {
    this.showMenu = !this.showMenu;
  }
  closeMenu() {
    this.showMenu = false;
  }
}
