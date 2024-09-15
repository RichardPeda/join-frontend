import { Component } from '@angular/core';
import { HeaderComponent } from '../shared/modules/header/header.component';
import { NavbarComponent } from '../shared/modules/navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { UserdataService } from '../services/userdata.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-legal-notice',
  standalone: true,
  imports: [HeaderComponent,NavbarComponent, RouterModule],
  templateUrl: './legal-notice.component.html',
  styleUrl: './legal-notice.component.scss'
})
export class LegalNoticeComponent {
  docId = '';
 

  constructor(  private userService: UserdataService, private _location :Location){
    this.docId = this.userService.loadIdFromSessionStorage()!;
  }

  navigateBack() {
    this._location.back();
  }
}
