import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Contact } from '../../interfaces/contact.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-singlecontact',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './singlecontact.component.html',
  styleUrl: './singlecontact.component.scss',
})
export class SinglecontactComponent {
  @Output() selectedContact = new EventEmitter<Contact>();

  @Input() contact: Contact = {
    contactID : '',
    badgecolor: '',
    name: '',
    email: '',
    phone: '',
    initials: '',
    register: '',
    selected: false,
  };

  @Input() isSelected : boolean = false;

  /**
   * Emit which contact is selected
   * @param currentContact 
   */
  selectContact(currentContact: Contact) {
    this.selectedContact.emit(currentContact);
  }
}
