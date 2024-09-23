import { Injectable, inject } from '@angular/core';
import { UserdataService } from './userdata.service';
import {
  Firestore,
  collectionData,
  collection,
  doc,
  onSnapshot,
  addDoc,
  QuerySnapshot,
  DocumentData,
  getDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { User } from '../interfaces/user.interface';
import { Contact } from '../interfaces/contact.interface';
import { AsyncSubject, BehaviorSubject, Observable, Subject } from 'rxjs';
import { Task } from '../interfaces/task.interface';
import { ContactsService } from './contacts.service';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subtask } from '../interfaces/subtask.interface';
@Injectable({
  providedIn: 'root',
})
export class SessiondataService {
  docId = '';
  unsubGuest: any;
  firestore: Firestore = inject(Firestore);
  user: User = {
    id: '',
    name: '',
    userinitials: '',
    email: '',
    password: '',
    contacts: [],
    tasks: [],
  };
  userSubject: BehaviorSubject<any> = new BehaviorSubject({});
  public _selectedContact: BehaviorSubject<any> = new BehaviorSubject({});
  public _contactDeleted: BehaviorSubject<any> = new BehaviorSubject(false);

  _globalContacts: BehaviorSubject<any> = new BehaviorSubject<Contact[]>([]);
  _globalTasks: BehaviorSubject<any> = new BehaviorSubject<Task[]>([]);
  waitForData = false;
  showLoadingScreen = false;
  contacts: any = [];
  tasks = [];
  profileBadgeColors = [
    '#FF7A00',
    '#FF5EB3',
    '#6E52FF',
    '#9327FF',
    '#00BEE8',
    '#1FD7C1',
    '#FF745E',
    '#FFA35E',
    '#FC71FF',
    '#FFC701',
    '#0038FF',
    '#C3FF2B',
    '#FFE62B',
    '#FF4646',
    '#FFBB2B',
  ];

  fadeout: 'show' | 'hide' = 'show';
  reqTaskStatus: 'toDo' | 'inProgress' | 'awaitFeedback' | 'done' = 'toDo';
  public initials = new Subject<string>();
  public username = new Subject<string>();

  unsubUser: any;

  constructor(private userService: UserdataService, private http: HttpClient) {
    // this.docId = this.userService.loadIdFromSessionStorage();
    // this.unsubUser = onSnapshot(
    //   this.userService.getSingleDocRef('users', this.docId),
    //   (doc) => {
    //     let data = doc.data();
    //     this.user = this.userService.getCurrentUserData(doc.id, data!);
    //     this.userSubject.next(this.user);
    //     if (this.user) {
    //       this.initials.next(this.getInitials(this.user.name));
    //       this.username.next(this.user.name);
    //       if (this.selectedContact && this.selectedContact.name === '') {
    //         this.getFirstContact(this.user.contacts);
    //         this._selectedContact.next(this.selectedContact);
    //       }
    //     }
    //   }
    // );
  }

  getUserInfo() {
    return this.userSubject.asObservable();
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.unsubUser();
  }

  getAllTasks() {
    const url = environment.apiUrl + '/api/taskitems/';
    let headers = new HttpHeaders();
    headers = headers.append(
      'Authorization',
      'Token ' + localStorage.getItem('token')
    );

    return this.http.get(url, {
      headers: headers,
    });
  }

  getAllContacts() {
    this.loadingDataScreen();
    const url = environment.apiUrl + '/api/contacts/';
    let headers = new HttpHeaders();
    headers = headers.append(
      'Authorization',
      'Token ' + localStorage.getItem('token')
    );

    return this.http.get(url, {
      headers: headers,
    });
  }

  createContact(newContact: Contact) {
    this.loadingDataScreen();
    const url = environment.apiUrl + '/api/contacts/create/';

    let headers = new HttpHeaders();
    headers = headers.append(
      'Authorization',
      'Token ' + localStorage.getItem('token')
    );
    const options = { headers: headers };

    return this.http.post(url, newContact, options);
  }

  editContact(contact: Contact) {
    const url = environment.apiUrl + '/api/contacts/' + contact.id + '/';

    let headers = new HttpHeaders();
    headers = headers.append(
      'Authorization',
      'Token ' + localStorage.getItem('token')
    );
    const options = { headers: headers };

    return this.http.put(url, contact, options);
  }

  createTask(task: Task) {
    const url = environment.apiUrl + '/api/taskitems/create/';
    console.log(url);

    let headers = new HttpHeaders();
    headers = headers.append(
      'Authorization',
      'Token ' + localStorage.getItem('token')
    );
    const options = { headers: headers };

    return this.http.post(url, task, options);
  }

  /**
   *
   * @param task related task for subtask
   * @param subtask subtask itself
   * @returns Observable
   */
  createSubTask(taskID: string, subtask: Subtask[]) {
    const url = environment.apiUrl + '/api/subtasks/create/';
    console.log(url);

    let headers = new HttpHeaders();
    headers = headers.append(
      'Authorization',
      'Token ' + localStorage.getItem('token')
    );
    const options = { headers: headers };
    let body = subtask.map((sub) => {
      return {
        title: sub.title,
        rel_task: taskID,
      };
    });
    console.log(body);

    // const body = { title: subtask.title, rel_task: task };

    return this.http.post(url, body, options);
  }

  async getData(id: string) {
    // let docRef = this.userService.getSingleDocRef('users', this.docId);
    // const docSnap = await getDoc(docRef);
    // return docSnap.data();
  }

  async setContact(contact: Contact[]) {
    // let docRef = this.userService.getSingleDocRef('users', this.docId);
    // await updateDoc(docRef, {
    //   contacts: contact,
    // });
  }
  editTaskStatus(task: Task) {
    const url = environment.apiUrl + '/api/taskitems/' + task.id + '/status/';
    console.log(url);

    let headers = new HttpHeaders();
    headers = headers.append(
      'Authorization',
      'Token ' + localStorage.getItem('token')
    );
    const options = { headers: headers };
    const body = { status: task.status };

    return this.http.put(url, body, options);
  }

  editTask(task: Task) {
    const url = environment.apiUrl + '/api/taskitems/' + task.id + '/';
    console.log(url);

    let headers = new HttpHeaders();
    headers = headers.append(
      'Authorization',
      'Token ' + localStorage.getItem('token')
    );
    const options = { headers: headers };

    return this.http.put(url, task, options);
  }

  deleteContact(contact: Contact) {
    let update = false;
    let newContacts: Contact[] = this.user.contacts;
    newContacts.forEach((newContact, index) => {
      if (newContact.id === contact.id) {
        newContacts.splice(index, 1);
        update = true;
      }
    });
    if (update) this.setContact(newContacts);
    update = false;
    this.showOtherContact();
    this._contactDeleted.next(true);
    this._contactDeleted.next(false);
  }

  getInitials(name: string) {
    let splitName = name.split(' ', 2);

    let name_1 =
      typeof splitName[0].charAt(0) == 'string'
        ? splitName[0].charAt(0).toUpperCase()
        : '';
    let name_2 =
      typeof splitName[1]?.charAt(0) == 'string'
        ? splitName[1].charAt(0).toUpperCase()
        : '';

    return name_1 + name_2;
  }

  getRandomBadgeColor() {
    return this.profileBadgeColors[
      Math.round(Math.random() * this.profileBadgeColors.length)
    ];
  }

  compare(a: Contact, b: Contact) {
    if (a.register < b.register) {
      return -1;
    }
    if (a.register > b.register) {
      return 1;
    }
    return 0;
  }

  selectedContact: Contact = {
    id: '',
    badge_color: '',
    name: '',
    email: '',
    phone: '',
    initials: '',
    register: '',
    selected: false,
  };

  emptyContact: Contact = {
    id: '',
    badge_color: '',
    name: '',
    email: '',
    phone: '',
    initials: '',
    register: '',
    selected: false,
  };

  getFirstContact(contacts: Contact[]) {
    let contactArray = contacts;
    contactArray.sort(this.compare);
    this.selectedContact = contactArray[0];
  }

  showOtherContact() {
    let contactArray = this.user.contacts;
    contactArray.sort(this.compare);
    if (contactArray.length > 0) {
      this.selectedContact = contactArray[0];
      this.showContactDetails(this.selectedContact);
    } else this.showContactDetails(this.emptyContact);
  }

  showContactDetails(currentContact: Contact) {
    this.selectedContact = currentContact;
    this._selectedContact.next(this.selectedContact);
  }

  /**
   * Show a loading screen for minimum 1s
   */
  loadingDataScreen() {
    this.waitForData = true;
    this.showLoadingScreen = true;
    setTimeout(() => {
      this.showLoadingScreen = false;
    }, 1000);
  }
}
