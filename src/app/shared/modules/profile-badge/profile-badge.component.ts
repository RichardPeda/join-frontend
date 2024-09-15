import { Component, Input } from '@angular/core';
import { Contact } from '../../../interfaces/contact.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-badge.component.html',
  styleUrl: './profile-badge.component.scss',
})
export class ProfileBadgeComponent {
  @Input() initials: string = '';
  @Input() color: string = '';

}
