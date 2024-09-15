import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  Inject,
  Input,
  Optional,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  FormControl,
  ReactiveFormsModule,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { User } from '../../interfaces/user.interface';
import { SessiondataService } from '../../services/sessiondata.service';
import { ContactSelectionComponent } from '../../shared/modules/contact-selection/contact-selection.component';
import { ClickOutsideDirective } from '../../shared/click-outside.directive';
import { ClickOutsideMenuDirective } from '../../shared/click-outside-menu.directive';
import { Contact } from '../../interfaces/contact.interface';
import { Subtask } from '../../interfaces/subtask.interface';
import { SubtaskComponent } from '../../shared/modules/subtask/subtask.component';
import { ProfileBadgeComponent } from '../../shared/modules/profile-badge/profile-badge.component';
import { PrioritySelectionComponent } from '../../shared/modules/priority-selection/priority-selection.component';
import { Task } from '../../interfaces/task.interface';
import { HeaderComponent } from '../../shared/modules/header/header.component';
import { NavbarComponent } from '../../shared/modules/navbar/navbar.component';
import { TaskAddedSnackbarComponent } from '../../snackbars/task-added-snackbar/task-added-snackbar.component';
import { UserdataService } from '../../services/userdata.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PopupNotificationComponent } from '../../shared/modules/popup-notification/popup-notification.component';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ContactSelectionComponent,
    ClickOutsideDirective,
    ClickOutsideMenuDirective,
    SubtaskComponent,
    ProfileBadgeComponent,
    PrioritySelectionComponent,
    HeaderComponent,
    NavbarComponent,
    TaskAddedSnackbarComponent,
    PopupNotificationComponent,
  ],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class AddTaskComponent {
  _subscriptionUser: any;
  submitBtnClicked = false;
  localUser: User = {
    id: '',
    name: '',
    userinitials: '',
    email: '',
    password: '',
    contacts: [],
    tasks: [],
  };
  status: 'toDo' | 'inProgress' | 'awaitFeedback' | 'done' = 'toDo';

  subtasks: string[] = [];
  hidePopup = true;
  filteredContacts: Contact[];
  selectedContacts: Contact[] = [];
  subTasks: Subtask[] = [];
  notificationText = 'Task added to board';
  showNotification = false;
  currentDate = '';

  dropdownContactsClose = true;
  dropdownCategoryClose = true;
  subtaskInputDisable = true;
  catergoryString: string = 'Technical task';

  taskForm = this._formbuilder.group({
    title: ['', Validators.required],
    description: [''],
    contactField: [''],
    date: ['', Validators.required],
    category: ['', Validators.required],
    subtask: [''],
  });

  priority: 'medium' | 'urgent' | 'low' = 'medium';
  docId = '';
  constructor(
    private userService: UserdataService,
    private router: Router,
    private route: ActivatedRoute,
    private _formbuilder: FormBuilder,
    private sessionDataService: SessiondataService,
    @Optional() public dialogRef: MatDialogRef<AddTaskComponent>
  ) {
    this.docId = this.userService.loadIdFromSessionStorage()!;
    this.localUser = this.sessionDataService.user;
    this.filteredContacts = this.localUser.contacts;
  }

  ngOnInit() {
    this._subscriptionUser = this.sessionDataService.userSubject.subscribe(
      (user: User) => {
        this.localUser = user;
        this.filteredContacts = this.localUser.contacts;
      }
    );
    this.status = this.sessionDataService.reqTaskStatus;
    this.taskForm.controls['subtask'].disable();
    this.getCurrentDate();
  }

  ngOnDestroy() {
    this._subscriptionUser.unsubscribe();
  }

  getCurrentDate() {
    let date = new Date();
    this.currentDate = date.toLocaleDateString('en-CA');
  }

  /**
   * This function looks for all selected user contacts and push it to an array.
   */
  findselectedContacts() {
    this.selectedContacts = [];
    this.localUser.contacts.forEach((c) => {
      if (c.selected) this.selectedContacts.push(c);
    });
  }

  /**
   * This function returns true if the given value matches medium, urgent or low. Otherwise return false.
   * @param value represents the priority medium, urgent or low
   * @returns true if priority matches medium, urgent or low, otherwise returns false
   */
  checkValidPriority(value: string): boolean {
    if (value === 'medium') return true;
    else if (value === 'urgent') return true;
    else if (value === 'low') return true;
    else return false;
  }

  /**
   * Create a new task if the form is valid. Including selected contacts, validated priority and category.
   * The task is created with random taskID and with status of 'todo' and is applied to the database.
   * After creation the form will be resetted and a snackbar is shown.
   */
  createTask() {
    if (this.taskForm.valid) {
      this.findselectedContacts();
      let newTasks = this.sessionDataService.user.tasks;

      if (
        (this.taskForm.controls['category'].value === 'User Story' ||
          this.taskForm.controls['category'].value === 'Technical Task') &&
        this.checkValidPriority(this.priority)
      ) {
        let task: Task = {
          title: this.taskForm.controls['title'].value!,
          taskID: Math.floor(100000 + Math.random() * 900000).toString(),
          description: this.taskForm.controls['description'].value!,
          assignedContacts: this.selectedContacts,
          priority: this.priority,
          category: this.taskForm.controls['category'].value!,
          dueDate: this.taskForm.controls['date'].value!,
          status: this.status,
          subtasks: this.subTasks,
        };
        newTasks.push(task);
        this.sessionDataService.reqTaskStatus = 'toDo';
        this.sessionDataService.setTask(newTasks);
        this.resetForm();
        this.openSnackbar();
        setTimeout(() => {
          if (this.dialogRef) {
            this.closeDialog();
          }

          this.linkToBoard();
        }, 3000);
      }
    }
  }

  /**
   * Resets the form.
   */
  resetForm() {
    this.taskForm.clearValidators();
    this.taskForm.reset();
    this.submitBtnClicked = false;
    this.selectedContacts = [];
    this.subTasks = [];
    this.priority = 'medium';
  }

  /**
   * Set the priority to the given value.
   * @param prio selected priority - medium, urgent or low
   */
  setPriority(prio: 'medium' | 'urgent' | 'low') {
    this.priority = prio;
  }

  /**
   * Emitter if submit button is clicked.
   */
  btnIsClicked() {
    this.submitBtnClicked = true;
  }

  /**
   * The function checks the given form, if there is an error of the formfield and returns true to show a message.
   * @param form FormControl to validate
   * @returns true if the form has an error
   */
  validateRequiredFormMessage(form: FormControl) {
    let showTitleMessage = false;
    if (form.errors && (form.touched || form.dirty)) {
      showTitleMessage = true;
    }
    return showTitleMessage;
  }

  /**
   * The function checks the given form when submit button is clicked,
   * if there is an error of the formfield and returns true to show a message.
   * @param form FormControl to validate
   * @returns true if the form has an error
   */
  showAllRequiredMessages(form: FormControl) {
    let showTitleMessage = false;
    if (form.errors && this.submitBtnClicked) {
      showTitleMessage = true;
    }
    return showTitleMessage;
  }

  /**
   * Toggle the dropdown field of contacts open or close.
   */
  toggleDropdownContacts() {
    this.dropdownContactsClose = !this.dropdownContactsClose;
  }

  /**
   * Close the dropdown field of contacts.
   */
  closeDropdownContacts() {
    this.dropdownContactsClose = true;
  }

  /**
   * Open the dropdown field of contacts if the contact input field is not empty.
   * @param event
   */
  openDropdownContacts(event: Event) {
    if (this.taskForm.get('contactField')?.value == '')
      this.dropdownContactsClose = true;
    else this.dropdownContactsClose = false;
  }

  /**
   * Toggle the dropdown field of category open or close.
   */
  toggleDropdownCategory() {
    this.dropdownCategoryClose = !this.dropdownCategoryClose;
  }

  /**
   * close the dropdown field of category.
   */
  closeDropdownCategory() {
    this.dropdownCategoryClose = true;
  }

  /**
   * If the category is selected, fill the form field with this value and close the dropdown.
   * @param category Technical Task or User Story
   */
  selectCategory(category: string) {
    this.taskForm.patchValue({
      category: category,
    });
    this.closeDropdownCategory();
  }

  /**
   * Update the selected contacts.
   */
  updateSelected() {
    this.findselectedContacts();
  }

  /**
   * Filter the contacts when the contacts inputfield is filled and push them into an array.
   */
  filterContacts() {
    let compare: string | null | undefined =
      this.taskForm.controls['contactField']?.value?.toLowerCase();
    if (compare && compare.length > 0) {
      this.filteredContacts = [];
      this.localUser.contacts.forEach((contact) => {
        let lowContactName = contact.name.toLowerCase();
        if (lowContactName.includes(compare)) {
          this.filteredContacts.push(contact);
        }
      });
    } else {
      this.filteredContacts = this.localUser.contacts;
    }
  }

  /**
   * Creates a subtask when the field is valid. Set it to undone and push it to a temporary array.
   */
  createSubtask() {
    if (this.taskForm.controls['subtask'].value) {
      let subtask: Subtask = {
        title: this.taskForm.controls['subtask'].value,
        done: false,
      };
      this.subTasks.push(subtask);
    }
    this.disableSubtaskInput();
  }

  @ViewChild('participantRef')
  participantRef!: ElementRef;

  /**
   * Enable the input field of subtask and set the focus on it.
   */
  enableSubtaskInput() {
    this.subtaskInputDisable = false;
    this.taskForm.controls['subtask'].enable();
    this.participantRef.nativeElement.focus();
  }

  /**
   * Disable the input field of subtask.
   */
  disableSubtaskInput() {
    this.subtaskInputDisable = true;
    this.taskForm.controls['subtask'].reset();
    this.taskForm.controls['subtask'].disable();
  }

  /**
   * If the new subtask title is not empty, update it in the array. If its empty, delete it.
   * @param title new title of subtask
   * @param index number of subtask indes in temporary array
   */
  changeSubtaskTitle(title: string, index: number) {
    if (title) {
      this.subTasks[index].title = title;
    } else {
      this.subTasks.splice(index, 1);
    }
  }

  /**
   * Show snackbar when a task is created
   */
  openSnackbar() {
    this.showNotification = true;
    setTimeout(() => {
      this.showNotification = false;
    }, 2500);
  }

  /**
   * Routerlink to the board page.
   */
  linkToBoard() {
    this.router.navigate(['board/' + this.docId]);
  }

  /**
   * If the compontent is opened as dialog, close the dialog with this function.
   */
  closeDialog() {
    this.dialogRef.close();
  }
}
