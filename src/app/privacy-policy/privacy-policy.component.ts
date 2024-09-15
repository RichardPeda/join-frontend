import { Component } from '@angular/core';
import { HeaderComponent } from '../shared/modules/header/header.component';
import { NavbarComponent } from '../shared/modules/navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { UserdataService } from '../services/userdata.service';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [HeaderComponent, NavbarComponent, RouterModule],
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.scss'
})
export class PrivacyPolicyComponent {
  docId = '';
 

  constructor(  private userService: UserdataService,){
    this.docId = this.userService.loadIdFromSessionStorage()!;
  }
}
