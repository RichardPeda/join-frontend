import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UserdataService } from '../../../services/userdata.service';
import { CommonModule, Location } from '@angular/common';
import { SessiondataService } from '../../../services/sessiondata.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  docId = '';
  selectedPageName = 'summary';

  constructor(
    private userService: UserdataService,
    private router: Router,
    private location: Location,
  ) {
    this.docId = this.userService.loadIdFromSessionStorage()!;
  }

  ngOnInit() {
    this.selectedPageName = this.getURL();
  }

  linkToSummary() {
    this.router.navigate(['summary/' + this.docId]);
  }
  linkToBoard() {
    this.router.navigate(['board/' + this.docId]);
  }
  linkToContacts() {
    this.router.navigate(['contacts/' + this.docId]);
  }
  linkToAddTask() {
    this.router.navigate(['addtask/' + this.docId]);
  }
  linkToLegalNotice(){
    this.router.navigate(['legal-notice'])
  }
  linkToPrivacyPolicy(){
    this.router.navigate(['privacy-policy'])
  }

  getURL() {
    let path = this.location.path();
    if (path.includes('summary')) return 'summary';
    else if (path.includes('contacts')) return 'contacts';
    else if (path.includes('addtask')) return 'addtask';
    else if (path.includes('board')) return 'board';
    else if (path.includes('legal-notice')) return 'legal-notice';
    else if (path.includes('privacy-policy')) return 'privacy-policy';
    else return 'summary';
  }
}
