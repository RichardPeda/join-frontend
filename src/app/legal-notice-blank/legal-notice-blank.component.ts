import { Component } from '@angular/core';
import { HeaderBlankComponent } from '../shared/modules/header-blank/header-blank.component';
import { NavbarBlankComponent } from '../shared/modules/navbar-blank/navbar-blank.component';
import { RouterModule } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-legal-notice-blank',
  standalone: true,
  imports: [HeaderBlankComponent, NavbarBlankComponent, RouterModule],
  templateUrl: './legal-notice-blank.component.html',
  styleUrl: './legal-notice-blank.component.scss'
})
export class LegalNoticeBlankComponent {

  constructor(private _location : Location){}


  navigateBack() {
    this._location.back();
  }

}
