import { Component, Inject } from '@angular/core';
import { Task } from '../interfaces/task.interface';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SessiondataService } from '../services/sessiondata.service';
import { Contact } from '../interfaces/contact.interface';
import { Subtask } from '../interfaces/subtask.interface';
import { User } from '../interfaces/user.interface';
import { CommonModule } from '@angular/common';
import { ContactSelectionComponent } from '../shared/modules/contact-selection/contact-selection.component';
import { ClickOutsideDirective } from '../shared/click-outside.directive';
import { SubtaskComponent } from '../shared/modules/subtask/subtask.component';
import { ProfileBadgeComponent } from '../shared/modules/profile-badge/profile-badge.component';
import { PrioritySelectionComponent } from '../shared/modules/priority-selection/priority-selection.component';

@Component({
  selector: 'app-edit-task',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ContactSelectionComponent,
    ClickOutsideDirective,
    SubtaskComponent,
    ProfileBadgeComponent,
    PrioritySelectionComponent,
  ],
  templateUrl: './edit-task.component.html',
  styleUrl: './edit-task.component.scss',
})
export class EditTaskComponent {
  localTask: Task = {
    id: '',
    title: '',
    description: '',
    contacts: [],
    priority: 'medium',
    category: 'Technical Task',
    due_date: '',
    status: 'toDo',
    related_task: [],
  };

  _subscriptionUser: any;
  _subscripeContacts: any;
  submitBtnClicked = false;
  localContacts: Contact[] = [];

  subtasks: string[] = [];

  filteredContacts: Contact[] = [];
  selectedContacts: Contact[] = [];
  subTasks: Subtask[] = [];

  dropdownContactsClose = true;
  dropdownCategoryClose = true;
  subtaskInputDisable = true;
  catergoryString: string = 'Technical task';

  priority: 'medium' | 'urgent' | 'low' = 'medium';

  constructor(
    private _formbuilder: FormBuilder,
    private sessionDataService: SessiondataService,
    @Inject(MAT_DIALOG_DATA) public data: Task,
    public dialogRef: MatDialogRef<EditTaskComponent>
  ) {
    this.localTask = { ...data };

    // this.localUser = this.sessionDataService.user;
    if (this.localTask.contacts)
      this.filteredContacts = this.localTask.contacts;
  }

  taskForm = this._formbuilder.group({
    title: [this.localTask.title, Validators.required],
    description: [this.localTask.description],
    contactField: [''],
    date: [this.localTask.due_date, Validators.required],
    category: [this.localTask.category, Validators.required],
    subtask: [''],
  });

  ngOnInit() {
   
    this.sessionDataService.loadContacts();

    this._subscripeContacts = this.sessionDataService._globalContacts.subscribe(
      (contacts: Contact[]) => {
        this.localContacts = contacts;
        this.joinContacts();
       
      }
    );

    this.priority = this.localTask.priority;
    this.subTasks = this.localTask.related_task;
    this.taskForm.controls['title'].setValue(this.localTask.title);
    this.taskForm.controls['description'].setValue(this.localTask.description);
    this.taskForm.controls['date'].setValue(this.localTask.due_date);
    this.taskForm.controls['category'].setValue(this.localTask.category);
  }

  /**
   * For edit mode join the contacts with the selected contacts in one list.
   */
  joinContacts() {
    if (this.localContacts) this.filteredContacts = this.localContacts;

    this.filteredContacts.forEach((contact) => {
      this.localTask.contacts?.forEach((assigned) => {
        if (contact.id == assigned.id) {
          contact.selected = true;
        }
      });
    });
  }

  ngOnDestroy() {
    // this._subscriptionUser.unsubscribe();
  }

  /**
   * Filter the selected contacts of the task to mark them.
   */
  findselectedContacts() {
    this.selectedContacts = [];
    this.localContacts.forEach((c) => {
      if (c.selected) this.selectedContacts.push(c);
    });
  }

  /**
   * Returns true if the priority is medium, urgent or low. Otherwise return false.
   * @param value Priority
   * @returns boolean
   */
  checkValidPriority(value: string): boolean {
    if (value === 'medium' || value === 'urgent' || value === 'low')
      return true;
    else return false;
  }

  /**
   * Save the edited task. Validation check and emit an update of the dialog.
   */
  saveTask() {
    if (this.taskForm.valid) {
      this.findselectedContacts();

      if (
        (this.taskForm.controls['category'].value === 'User Story' ||
          this.taskForm.controls['category'].value === 'Technical Task') &&
        this.checkValidPriority(this.priority)
      ) {
        let task: Task = {
          title: this.taskForm.controls['title'].value!,
          id: this.localTask.id,
          description: this.taskForm.controls['description'].value!,
          contacts: this.selectedContacts,
          priority: this.priority,
          category: this.taskForm.controls['category'].value!,
          due_date: this.taskForm.controls['date'].value!,
          status: this.data.status,
          related_task: this.subTasks,
        };

        this.data = task;
        this.dialogRef.close({ event: 'update', data: this.data });
        this.resetForm();
      }
    }
  }

  /**
   * Reset the form fields and the priority.
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
   * Set the priority.
   * @param prio Setup priority
   */
  setPriority(prio: 'medium' | 'urgent' | 'low') {
    this.priority = prio;
  }

  /**
   * Emit that the OK button is clicked.
   */
  btnIsClicked() {
    this.submitBtnClicked = true;
  }

  /**
   * Validate the form input. Shows a message when form is not valid.
   * @param form FormControl
   * @returns boolean
   */
  validateRequiredFormMessage(form: FormControl) {
    let showTitleMessage = false;
    if (form.errors && (form.touched || form.dirty)) {
      showTitleMessage = true;
    }
    return showTitleMessage;
  }

  /**
   * When the Ok button is clicked show messages when forms are invalid.
   * @param form FormControl
   * @returns boolean
   */
  showAllRequiredMessages(form: FormControl) {
    let showTitleMessage = false;
    if (form.errors && this.submitBtnClicked) {
      showTitleMessage = true;
    }
    return showTitleMessage;
  }

  /**
   * Toggle to show contact dropdown menu.
   */
  toggleDropdownContacts() {
    this.dropdownContactsClose = !this.dropdownContactsClose;
  }

  /**
   * Close contact dropdown menu.
   */
  closeDropdownContacts() {
    this.dropdownContactsClose = true;
  }

  /**
   * When the filter function of contacts is used, open the dropdown menu. When the field is empty close it.
   */
  openDropdownContacts() {
    if (this.taskForm.get('contactField')?.value == '')
      this.dropdownContactsClose = true;
    else this.dropdownContactsClose = false;
  }

  /**
   * Toggle to show category dropdown menu.
   */
  toggleDropdownCategory() {
    this.dropdownCategoryClose = !this.dropdownCategoryClose;
  }

  /**
   * Close category dropdown menu.
   */
  closeDropdownCategory() {
    this.dropdownCategoryClose = true;
  }

  /**
   * Select category and patch to formfield value.
   * @param category Chosen category
   */
  selectCategory(category: 'Technical Task' | 'User Story') {
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
   * Filter contacts when input field is filled. When the input field is empty, all contacts are shown.
   */
  filterContacts() {
    let compare: string | null | undefined =
      this.taskForm.controls['contactField']?.value?.toLowerCase();
    if (compare && compare.length > 0) {
      this.filteredContacts = [];
      this.localContacts.forEach((contact) => {
        let lowContactName = contact.name.toLowerCase();
        if (lowContactName.includes(compare)) {
          this.filteredContacts.push(contact);
        }
      });
    } else {
      this.filteredContacts = this.localContacts;
    }
  }

  /**
   * Create new subtask and add it to the array. Always set to unchecked.
   */
  createSubtask() {
    if (this.taskForm.controls['subtask'].valid) {
      let subtask: Subtask = {
        title: this.taskForm.controls['subtask'].value!,
        checked: false,
      };
      this.subTasks.push(subtask);
    }
  }

  /**
   * Enable subtask input field.
   */
  enableSubtaskInput() {
    this.subtaskInputDisable = false;
  }

  /**
   * When subtask title changed, save it. An empty field deletes the subtask.
   * @param title subtask title
   * @param index index in subtask array
   */
  changeSubtaskTitle(title: string, index: number) {
    if (title === '') this.subTasks.splice(index, 1);
    else this.subTasks[index].title = title;
  }
}
