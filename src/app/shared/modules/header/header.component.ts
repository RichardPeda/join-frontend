import { Component } from '@angular/core';
import { Router } from '@angular/router';
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
    private router: Router,
    private sessionDataService: SessiondataService
  ) {
  }

  ngOnInit(){
    let name = localStorage.getItem('username')
    if (name)  this.localUser.userinitials = this.sessionDataService.getInitials(name)
  }

  ngOnDestroy() {
    // this._subscriptionUser.unsubscribe();
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
    location.replace("/");
  }

  openMenu() {
    this.showMenu = !this.showMenu;
  }
  closeMenu() {
    this.showMenu = false;
  }
}
