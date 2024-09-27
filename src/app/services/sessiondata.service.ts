import { Injectable, inject } from '@angular/core';
import { UserdataService } from './userdata.service';
import { User } from '../interfaces/user.interface';
import { Contact } from '../interfaces/contact.interface';
import { BehaviorSubject, lastValueFrom, Subject } from 'rxjs';
import { Task } from '../interfaces/task.interface';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subtask } from '../interfaces/subtask.interface';
@Injectable({
  providedIn: 'root',
})
export class SessiondataService {
  docId = '';
  unsubGuest: any;

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
  localTasks: Task[] = [];
  localContacts: Contact[] = [];

  fadeout: 'show' | 'hide' = 'show';
  reqTaskStatus: 'toDo' | 'inProgress' | 'awaitFeedback' | 'done' = 'toDo';
  public initials = new Subject<string>();
  public username = new Subject<string>();

  unsubUser: any;

  headers = new HttpHeaders();

  constructor(private userService: UserdataService, private http: HttpClient) {
    this.headers = this.headers.append(
      'Authorization',
      'Token ' + localStorage.getItem('token')
    );
    console.log(this.headers);
  }

  //CLEAR GUEST
  clearGuestUser() {
    let name = 'guest';
    let email = 'demo123456@mail.com';
    let password = '123456';
    const url = environment.apiUrl + '/api/guestdelete/';
    const body = {
      email: email,
      password: password,
      name: name,
    };
    return lastValueFrom(this.http.post(url, body));
  }

  //REGISTER
  registerNewUserAPI(email: string, password: string, name: string) {
    const url = environment.apiUrl + '/api/signup/';
    const body = {
      email: email,
      password: password,
      name: name,
    };
    return lastValueFrom(this.http.post(url, body));
  }

  //CONTACTS
  loadContacts() {
    this.loadingDataScreen();
    this.getAllContactsFromAPI().subscribe((data: any) => {
      if (data) {
        this.waitForData = false;
        this.localContacts = data.map((data: any): Contact => {
          return {
            id: data.id,
            email: data.email,
            badge_color: data.badge_color,
            initials: data.initials,
            name: data.name,
            phone: data.phone,
            register: data.register,
            selected: data.selected,
          };
        });
        if (this.localContacts) this._globalContacts.next(this.localContacts);
      }
    });
  }

  getAllContactsFromAPI() {
    this.loadingDataScreen();
    const url = environment.apiUrl + '/api/contacts/';
    return this.http.get(url, {
      headers: this.headers,
    });
  }

  createNewContact(contact: Contact) {
    this.loadingDataScreen();
    this.createContactAPI(contact).subscribe((result: any) => {
      if (result) {
        this.waitForData = false;
        this.localContacts.push(result);
        this._globalContacts.next(this.localContacts);
      }
    });
  }

  createContactAPI(newContact: Contact) {
    this.loadingDataScreen();
    const url = environment.apiUrl + '/api/contacts/create/';
    const options = { headers: this.headers };
    return this.http.post(url, newContact, options);
  }

  deleteContact(contact: Contact) {
    this.loadingDataScreen();
    this.deleteContactAPI(contact).subscribe((response: any) => {
      if (response) {
        this.waitForData = false;
        if (response.status == 204) {
          let index = this.localContacts.findIndex(
            (element) => element.id == contact.id
          );
          if (index > -1) this.localContacts.splice(index, 1);
          this._globalContacts.next(this.localContacts);
          this._contactDeleted.next(true);
        }
      }
    });
  }

  deleteContactAPI(contact: Contact) {
    const url = environment.apiUrl + '/api/contacts/' + contact.id + '/';
    return this.http.delete(url, {
      headers: this.headers,
      observe: 'response',
    });
  }

  //TASKS
  loadTasks() {
    this.loadingDataScreen();
    this.getAllTasksFromAPI().subscribe((data: any) => {
      if (data) {
        this.waitForData = false;
        this.localTasks = data.map((data: any): Task => {
          return {
            id: data.id,
            category: data.category,
            description: data.description,
            due_date: data.due_date,
            priority: data.priority,
            status: data.status,
            title: data.title,
            related_task: data.related_task,
            contacts: data.contacts,
          };
        });
        this._globalTasks.next(this.localTasks);
      }
    });
  }

  getAllTasksFromAPI() {
    const url = environment.apiUrl + '/api/taskitems/';
    let headers = new HttpHeaders();
    return this.http.get(url, {
      headers: this.headers,
    });
  }

  createTask(task: Task, subtasks: Subtask[]) {
    this.loadingDataScreen();
    this.createTaskAPI(task).subscribe((data: any) => {
      if (data) {
        if (subtasks) {
          let currentTask: Task = data;
          if (currentTask.id) {
            this.createSubTaskAPI(currentTask.id, subtasks).subscribe(
              (data: any) => {
                if (data) {
                  this.loadTasks();
                }
              }
            );
          }
        }
      }
    });
  }

  createTaskAPI(task: Task) {
    const url = environment.apiUrl + '/api/taskitems/create/';
    console.log(url);
    const options = { headers: this.headers };

    return this.http.post(url, task, options);
  }

  deleteTask(task: Task) {
    this.deleteTaskAPI(task).subscribe((response: any) => {
      if (response) {
        if (response.status == 204) {
          let index = this.localTasks.findIndex(
            (element) => element.id == task.id
          );
          if (index > -1) this.localTasks.splice(index, 1);
          this._globalTasks.next(this.localTasks);
        }
      }
    });
  }

  deleteTaskAPI(task: Task) {
    const url = environment.apiUrl + '/api/taskitems/' + task.id + '/';
    return this.http.delete(url, {
      headers: this.headers,
      observe: 'response',
    });
  }

  editTask(index: number, taskToEdit: Task) {
    this.editTaskAPI(taskToEdit).subscribe((data: any) => {
      if (data) {
        this.localTasks.splice(index, 1, taskToEdit);
        this._globalTasks.next(this.localTasks);
      }
    });
  }

  editTaskAPI(task: Task) {
    const url = environment.apiUrl + '/api/taskitems/' + task.id + '/';
    const options = { headers: this.headers };
    return this.http.put(url, task, options);
  }

  updateTaskStatus(index: number, task: Task) {
    this.editTaskStatusAPI(task).subscribe((data: any) => {
      if (data) {
        this.localTasks.splice(index, 1, task);
        this._globalTasks.next(this.localTasks);
      }
    });
  }

  editTaskStatusAPI(task: Task) {
    const url = environment.apiUrl + '/api/taskitems/' + task.id + '/status/';
    console.log(url);
    const options = { headers: this.headers };
    const body = { status: task.status };

    return this.http.put(url, body, options);
  }

  //SUBTASKS
  changeSubtaskChecked(id: string, subtask: Subtask) {
    this.changeSubtaskCheckedAPI(subtask).subscribe((data: any) => {
      if (data) {
        this._globalTasks.next(this.localTasks);
      }
    });
  }

  changeSubtaskCheckedAPI(subtask: Subtask) {
    const url =
      environment.apiUrl + '/api/subtasks/' + subtask.id + '/checked/';
    const options = { headers: this.headers };
    const body = { checked: subtask.checked };

    return this.http.put(url, body, options);
  }

  createSubTaskAPI(taskID: string, subtask: Subtask[]) {
    const url = environment.apiUrl + '/api/subtasks/create/';
    const options = { headers: this.headers };
    let body = subtask.map((sub) => {
      return {
        title: sub.title,
        rel_task: taskID,
      };
    });
    console.log(body);
    return this.http.post(url, body, options);
  }

  getUserInfo() {
    return this.userSubject.asObservable();
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.unsubUser();
  }

  editContactAPI(contact: Contact) {
    const url = environment.apiUrl + '/api/contacts/' + contact.id + '/';
    const options = { headers: this.headers };
    return this.http.put(url, contact, options);
  }

  /**
   *
   * @param task related task for subtask
   * @param subtask subtask itself
   * @returns Observable
   */

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
    let contactArray = this.localContacts;
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
   * Show a loading screen for minimum 0,5s
   */
  loadingDataScreen() {
    this.waitForData = true;
    this.showLoadingScreen = true;
    setTimeout(() => {
      this.showLoadingScreen = false;
    }, 500);
  }
}
