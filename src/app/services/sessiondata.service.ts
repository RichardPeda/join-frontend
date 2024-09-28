import { Injectable, inject } from '@angular/core';
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

  constructor(private http: HttpClient) {
    this.headers = this.headers.append(
      'Authorization',
      'Token ' + localStorage.getItem('token')
    );
  }

  //GUEST
  /**
   * This function deletes the guest user in the database
   * @returns http response of guest user
   */
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
  /**
   * This function send a request to the api and registers a new user
   * @param email user email
   * @param password user password
   * @param name username
   * @returns http response
   */
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
  /**
   * This function loads all contacts from the api and give the rusult to the subscriber
   */
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

  /**
   * This functions sends a request to the api to get all contacts
   * @returns http response all contacts
   */
  getAllContactsFromAPI() {
    this.loadingDataScreen();
    const url = environment.apiUrl + '/api/contacts/';
    return this.http.get(url, {
      headers: this.headers,
    });
  }

  /**
   * This function creates a new contact in the database and save the result in the subscriber
   * @param contact new contact
   */
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

  /**
   * This function send a request to the api to create a new contact
   * @param newContact contact to create in the database
   * @returns http response and status of the created contact
   */
  createContactAPI(newContact: Contact) {
    this.loadingDataScreen();
    const url = environment.apiUrl + '/api/contacts/create/';
    const options = { headers: this.headers };
    return this.http.post(url, newContact, options);
  }

  /**
   * This function deletes a contact in the database and save the result in the subscriber
   * @param contact contact to delete
   */
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

  /**
   * This function send the request to the api to delete the contact in the database
   * @param contact contact to delete
   * @returns http response and status
   */
  deleteContactAPI(contact: Contact) {
    const url = environment.apiUrl + '/api/contacts/' + contact.id + '/';
    return this.http.delete(url, {
      headers: this.headers,
      observe: 'response',
    });
  }

  //TASKS
  /**
   * This function loads all tasks from the api and save them in the subscriber
   */
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

  /**
   * This function sends the request to the api to get all tasks
   * @returns http response all tasks
   */
  getAllTasksFromAPI() {
    const url = environment.apiUrl + '/api/taskitems/';
    let headers = new HttpHeaders();
    return this.http.get(url, {
      headers: this.headers,
    });
  }

  /**
   * This function creates a new task and subtask in the database and reloads all tasks
   * @param task new task to create
   * @param subtasks new substask to create if existing
   */
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

  /**
   * This function sends the request to the api to create a new task
   * @param task new task to create
   * @returns http resonse and status of the new task
   */
  createTaskAPI(task: Task) {
    const url = environment.apiUrl + '/api/taskitems/create/';
    const options = { headers: this.headers };

    return this.http.post(url, task, options);
  }

  /**
   * This function deletes a given task in the database and removes it from subscriber
   * @param task task to be deleted
   */
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

  /**
   * This function sends a request to the api to delete a task
   * @param task task to delete
   * @returns http status
   */
  deleteTaskAPI(task: Task) {
    const url = environment.apiUrl + '/api/taskitems/' + task.id + '/';
    return this.http.delete(url, {
      headers: this.headers,
      observe: 'response',
    });
  }

  /**
   * This function edits a existing task
   * @param index index of the task to change
   * @param taskToEdit new customized task
   */
  editTask(index: number, taskToEdit: Task) {
    this.editTaskAPI(taskToEdit).subscribe((data: any) => {
      if (data) {
        this.localTasks.splice(index, 1, taskToEdit);
        this._globalTasks.next(this.localTasks);
      }
    });
  }

  /**
   * This function sends a request to the api to update a task
   * @param task task to update
   * @returns http response of task and status
   */
  editTaskAPI(task: Task) {
    const url = environment.apiUrl + '/api/taskitems/' + task.id + '/';
    const options = { headers: this.headers };
    return this.http.put(url, task, options);
  }

  /**
   * This function change the status of a task when moved to another column in the board and save the result in the subscriber
   * @param index index of task
   * @param task customized task
   */
  updateTaskStatus(index: number, task: Task) {
    this.editTaskStatusAPI(task).subscribe((data: any) => {
      if (data) {
        this.localTasks.splice(index, 1, task);
        this._globalTasks.next(this.localTasks);
      }
    });
  }

  /**
   * This function sends a request to the api to change the status of the task
   * @param task taks to update
   * @returns http resonse of task
   */
  editTaskStatusAPI(task: Task) {
    const url = environment.apiUrl + '/api/taskitems/' + task.id + '/status/';
    const options = { headers: this.headers };
    const body = { status: task.status };

    return this.http.put(url, body, options);
  }

  //SUBTASKS
  /**
   * This function change the status of the subtask and save the result to the subscriber
   * @param id id of the subtask
   * @param subtask subtask to update
   */
  changeSubtaskChecked(id: string, subtask: Subtask) {
    this.changeSubtaskCheckedAPI(subtask).subscribe((data: any) => {
      if (data) {
        this._globalTasks.next(this.localTasks);
      }
    });
  }

  /**
   * This fuction sends the request to the api to update the subtask checked status
   * @param subtask subtask to update
   * @returns http response of subtask
   */
  changeSubtaskCheckedAPI(subtask: Subtask) {
    const url =
      environment.apiUrl + '/api/subtasks/' + subtask.id + '/checked/';
    const options = { headers: this.headers };
    const body = { checked: subtask.checked };

    return this.http.put(url, body, options);
  }

  /**
   * This function sends the request to the api to create a new subtask
   * @param taskID related task id
   * @param subtask new subtask
   * @returns http response and status
   */
  createSubTaskAPI(taskID: string, subtask: Subtask[]) {
    const url = environment.apiUrl + '/api/subtasks/create/';
    const options = { headers: this.headers };
    let body = subtask.map((sub) => {
      return {
        title: sub.title,
        rel_task: taskID,
      };
    });
    return this.http.post(url, body, options);
  }

  /**
   * This function sends the request to the api to update a contact
   * @param contact customized contact
   * @returns http response of contact
   */
  editContactAPI(contact: Contact) {
    const url = environment.apiUrl + '/api/contacts/' + contact.id + '/';
    const options = { headers: this.headers };
    return this.http.put(url, contact, options);
  }

  /**
   * This function get the initials of the username and returns them
   * @param name username
   * @returns initials
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
