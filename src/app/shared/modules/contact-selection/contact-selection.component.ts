import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Contact } from '../../../interfaces/contact.interface';
import { CommonModule } from '@angular/common';
import { ProfileBadgeComponent } from '../profile-badge/profile-badge.component';

@Component({
  selector: 'app-contact-selection',
  standalone: true,
  imports: [CommonModule, ProfileBadgeComponent],
  templateUrl: './contact-selection.component.html',
  styleUrl: './contact-selection.component.scss',
})
export class ContactSelectionComponent {
  @Input() contact: Contact = {
    contactID: '',
    badgecolor: '',
    name: '',
    email: '',
    phone: '',
    initials: '',
    register: '',
    selected: false,
  };
  @Output() newSelection = new EventEmitter<void>();

  selectItem() {
    this.contact.selected = !this.contact.selected;    
    this.newSelection.emit();
  }
}
