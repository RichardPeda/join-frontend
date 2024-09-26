import {
  ChangeDetectorRef,
  Component,
  HostListener,
  OnInit,
  Renderer2,
} from '@angular/core';
import { Contact } from '../interfaces/contact.interface';
import { SinglecontactComponent } from './singlecontact/singlecontact.component';
import { CommonModule } from '@angular/common';
import { ContactDetailsComponent } from './contact-details/contact-details.component';
import { HeaderComponent } from '../shared/modules/header/header.component';
import { NavbarComponent } from '../shared/modules/navbar/navbar.component';
import { AddContactComponent } from './add-contact/add-contact.component';
import { ContactsService } from '../services/contacts.service';
import { UserdataService } from '../services/userdata.service';
import { SessiondataService } from '../services/sessiondata.service';
import { ActivatedRoute } from '@angular/router';
import { User } from '../interfaces/user.interface';
import { of } from 'rxjs';
import { PopupNotificationComponent } from '../shared/modules/popup-notification/popup-notification.component';
import { LoadingScreenComponent } from '../shared/modules/loading-screen/loading-screen.component';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [
    SinglecontactComponent,
    ContactDetailsComponent,
    CommonModule,
    HeaderComponent,
    NavbarComponent,
    AddContactComponent,
    PopupNotificationComponent,
    LoadingScreenComponent,
  ],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss',
})
export class ContactsComponent {
  _subscriptionUser: any;
  _subscriptionContact: any;
  _subscriptionDeleted: any;
  _subscripeContacts: any;
  $usercontact: any;
  registerLetters: string[] = [];
  localContacts: Contact[] = [];
  // localUser: User = {
  //   id: '',
  //   name: '',
  //   userinitials: '',
  //   email: '',
  //   password: '',
  //   contacts: [
  //     {
  //       badgecolor: '',
  //       email: '',
  //       id: '',
  //       initials: '',
  //       name: '',
  //       phone: '',
  //       register: '',
  //       selected: false,
  //     },
  //   ],
  //   tasks: [],
  // };

  showNotification = false;
  notificationText = 'Contact succesfully created';

  selectedContact: Contact = {
    id: '3',
    badge_color: '#FFA35E',
    initials: 'AF',
    register: 'A',
    name: 'Arne Fröhlich',
    email: 'fröhlich@24-7.com',
    phone: '+49 815 79183212',
    selected: false,
  };

  innerWidth = 0;
  mobileMode = false;
  openDetailsMenu = false;

  constructor(
    private _renderer: Renderer2,
    public contactService: ContactsService,
    public userService: UserdataService,
    public sessionDataService: SessiondataService,
    public activatedroute: ActivatedRoute,
    private ref: ChangeDetectorRef
  ) {
    // this.sessionDataService.user.contacts.sort(this.sessionDataService.compare);
  }

  ngOnInit() {
    this._renderer.setStyle(document.body, 'overflow-x', 'hidden');
    this.checkMobile();
    this.sessionDataService.loadContacts();

    this._subscripeContacts = this.sessionDataService._globalContacts.subscribe(
      (contacts: Contact[]) => {
        this.localContacts = contacts;

        if (this.localContacts) {
          this.sessionDataService.waitForData = false;
          this.localContacts.sort(this.sessionDataService.compare);
          this.getRegisterLetters(this.localContacts);
        }
        this.sessionDataService.showContactDetails(this.localContacts[0]);
      }
    );

    // this._subscriptionUser = this.sessionDataService
    //   .getUserInfo()
    //   .subscribe((user: User) => {
    //     this.localUser = user;

    //     if (this.localUser.contacts) {
    //       this.sessionDataService.user.contacts.sort(
    //         this.sessionDataService.compare
    //       );
    //       this.getRegisterLetters(this.localUser.contacts);
    //     }
    //   });

    // this._subscriptionContact =
    //   this.sessionDataService._selectedContact.subscribe((contact: Contact) => {
    //     if (contact) this.selectedContact = contact;
    //   });
    this._subscriptionDeleted =
      this.sessionDataService._contactDeleted.subscribe(
        (isDeleted: boolean) => {
          if (isDeleted) this.showSnackbar('Contact successfully deleted');
        }
      );
  }

  ngOnDestroy() {
    // this._subscriptionUser.unsubscribe();
    this._subscripeContacts.unsubscribe();
    this._subscriptionDeleted.unsubscribe();
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.checkMobile();
  }

 

  editContact(contact: Contact) {
    this.sessionDataService.editContactAPI(contact).subscribe((result: any) => {
      if (result) {
        this.localContacts.splice(
          this.localContacts.findIndex((e) => e.id === result.id),
          1,
          result
        );
        this.sessionDataService._globalContacts.next(this.localContacts);
      }
    });
  }
  /**
   * Check if the page is in mobile mode. Close details if not.
   */
  checkMobile() {
    let width = window.innerWidth;
    this.mobileMode = width <= 950 ? true : false;
    if (!this.mobileMode) this.closeDetailsMobile();
  }
  /**
   * Open the details as dialog only in mobile mode.
   */
  openDetailsMobile() {
    if (this.mobileMode) this.openDetailsMenu = true;
  }
  /**
   * Close the details view for mobile mode.
   */
  closeDetailsMobile() {
    this.openDetailsMenu = false;
  }

  showSnackbar(eventText: string) {
    this.showNotification = true;
    this.notificationText = eventText;

    setTimeout(() => {
      this.showNotification = false;
    }, 2500);
  }

  getRegisterLetters(contacts: Contact[]) {
    this.registerLetters = [];
    contacts.forEach((contact) => {
      if (!this.registerLetters.includes(contact.register)) {
        this.registerLetters.push(contact.register);
      }
    });
    this.registerLetters.sort();
  }

  selectCurrentContact(contact: Contact) {
    this.selectedContact = contact;
  }
}
