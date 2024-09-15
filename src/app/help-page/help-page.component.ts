import { Component } from '@angular/core';
import { HeaderComponent } from '../shared/modules/header/header.component';
import { NavbarComponent } from '../shared/modules/navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { UserdataService } from '../services/userdata.service';

@Component({
  selector: 'app-help-page',
  standalone: true,
  imports: [HeaderComponent, NavbarComponent, RouterModule],
  templateUrl: './help-page.component.html',
  styleUrl: './help-page.component.scss',
})
export class HelpPageComponent {
  docId = '';

  constructor(private userService: UserdataService) {
    this.docId = this.userService.loadIdFromSessionStorage()!;
  }
}
