import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { Contact } from '../../interfaces/contact.interface';
import { CommonModule } from '@angular/common';
import { ContactsService } from '../../services/contacts.service';
import { SessiondataService } from '../../services/sessiondata.service';
import { ClickOutsideDirective } from '../../shared/click-outside.directive';

@Component({
  selector: 'app-contact-details',
  standalone: true,
  imports: [CommonModule, ClickOutsideDirective],
  templateUrl: './contact-details.component.html',
  styleUrl: './contact-details.component.scss',
})
export class ContactDetailsComponent {
  detailcontact: Contact = {
    contactID: '',
    badgecolor: '',
    initials: '',
    register: '',
    name: '',
    email: '',
    phone: '',
    selected: false,
  };

  @Input() mobile: boolean = false;

  showDialog = false;
  cooldown = false;
  RECHARGE_TIME = 100; //ms
  _subscriptionContact: any;

  constructor(
    public contactService: ContactsService,
    public sessionService: SessiondataService,
    private ref: ChangeDetectorRef
  ) {
   
    this._subscriptionContact = this.sessionService._selectedContact.subscribe(
      (contact: Contact) => {
        if (contact) this.detailcontact = contact;
      
      }
    );
  }

  ngOnInit() {
   
   
  }

  ngOnDestroy() {
    this._subscriptionContact.unsubscribe();
  }
  /**
   * Starts a short cooldown to prevent too much trigger events.
   */
  startCooldown() {
    this.cooldown = true;
    setTimeout(() => {
      this.cooldown = false;
    }, this.RECHARGE_TIME);
  }

  /**
   * Open the contact details as a dialog in mobile mode
   */
  openDialog() {
    if (!this.showDialog) {
      this.showDialog = true;
      this.startCooldown();
    } else this.closeDialog;
  }
  /**
   * Close the contact details as a dialog in mobile mode
   */
  closeDialog() {
    if (this.showDialog && !this.cooldown) this.showDialog = false;
  }

  /**
   * Select the first contact of the list to fill the details component.
   */
  // getFirstContact() {
  //   this.sessionService.getFirstContact();
  // }
}
