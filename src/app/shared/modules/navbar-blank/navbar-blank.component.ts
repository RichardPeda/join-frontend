import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar-blank',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar-blank.component.html',
  styleUrl: './navbar-blank.component.scss',
})
export class NavbarBlankComponent {
  selectedPageName = '';

  constructor(private router: Router, private location: Location) {}

  ngOnInit() {
    this.selectedPageName = this.getURL();
  }

  linkToLegalNotice() {
    this.router.navigate(['legal-notice-blank']);
  }
  linkToPrivacyPolicy() {
    this.router.navigate(['privacy-policy-blank']);
  }

  getURL() {
    let path = this.location.path();

    if (path.includes('legal-notice')) return 'legal-notice';
    else return 'privacy-policy';
  }
}
