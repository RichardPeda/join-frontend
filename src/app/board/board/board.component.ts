import { Component, HostListener, Renderer2 } from '@angular/core';
import { HeaderComponent } from '../../shared/modules/header/header.component';
import { NavbarComponent } from '../../shared/modules/navbar/navbar.component';
import { BoardCardComponent } from '../board-card/board-card.component';
import { User } from '../../interfaces/user.interface';
import { UserdataService } from '../../services/userdata.service';
import { SessiondataService } from '../../services/sessiondata.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DialogDetailCardComponent } from '../dialog-detail-card/dialog-detail-card.component';
import { EditTaskComponent } from '../../edit-task/edit-task.component';
import { Task } from '../../interfaces/task.interface';
import { CommonModule } from '@angular/common';
import {
  DragDropModule,
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
  CdkDragPlaceholder,
  CdkDragEnter,
  CdkDragExit,
  CdkDragStart,
} from '@angular/cdk/drag-drop';
import { AddTaskComponent } from '../../task/add-task/add-task.component';
import { Router } from '@angular/router';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [
    HeaderComponent,
    NavbarComponent,
    BoardCardComponent,
    MatDialogModule,
    DialogDetailCardComponent,
    EditTaskComponent,
    CommonModule,
    DragDropModule,
    CdkDropList,
    CdkDrag,
    CdkDragPlaceholder,
    AddTaskComponent,
    FormsModule,
  ],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent {
  _subscriptionUser: any;
  _subscriptionDialog: any;
  _subscriptionEditDialog: any;
  _subscriptionAddDialog: any;
  editmode = false;
  mobileMode = false;
  localUser: User = {
    id: '',
    name: '',
    userinitials: '',
    email: '',
    password: '',
    contacts: [],
    tasks: [],
  };
  docId = '';
  todo = ['toDo'];
  inProgress = ['inProgress'];
  awaitFeedback = ['awaitFeedback'];
  done = ['done'];

  dragableTask: Object = [];

  amountTasksTodo = 0;
  amountTasksInProgress = 0;
  amountTasksAwaitFeedback = 0;
  amountTasksDone = 0;
  hideGhostCard = [true, true, true, true];
  hideLabel = [false, false, false, false];
  rotateValue = 0;
  filterActive = false;
  searchInput = '';
  filteredTasks: string[] = [];

  constructor(
    public userService: UserdataService,
    public sessionDataService: SessiondataService,
    private _renderer: Renderer2,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.localUser = this.sessionDataService.user;
    this.docId = this.userService.loadIdFromSessionStorage()!;
  }

  async ngOnInit() {
    this._renderer.setStyle(document.body, 'overflow-x', 'hidden');
    this.checkMobile();
    this._subscriptionUser = this.sessionDataService.userSubject.subscribe(
      (user: User) => {
        this.localUser = user;
        if (this.localUser.tasks) this.countTaskStatus();
      }
    );
  }

  /**
   * Unsubscribe the Observables
   */
  ngOnDestroy() {
    this._subscriptionUser.unsubscribe();
    if (this._subscriptionDialog) {
      this._subscriptionDialog.unsubscribe();
    }
    if (this._subscriptionEditDialog) {
      this._subscriptionEditDialog.unsubscribe();
    }
  }

  /**
   * Opens a MatDialog, detail view of the clicked card
   * @param event Mouseevent
   * @param index index of task
   */
  openDetailDialog(event: MouseEvent, index: number) {
    event.preventDefault();
    const dialogRef = this.dialog.open(DialogDetailCardComponent, {
      minWidth: 'min(400px, 100%)',
      maxHeight: '100%',
      data: this.localUser.tasks[index],
      scrollStrategy: new NoopScrollStrategy(),
    });
    this._subscriptionDialog = dialogRef.afterClosed().subscribe((result) => {
      if (result && result.event == 'editmode') {
        this.openEditDialog(index);
      } else if (result && result.event == 'delete')
        this.localUser.tasks.splice(index, 1);
      this.sessionDataService.setTask(this.localUser.tasks);
    });
  }

  /**
   * Opens a MatDialog, to edit the task
   * @param index index of task
   */
  openEditDialog(index: number) {
    const editDialogRef = this.dialog.open(EditTaskComponent, {
      minWidth: 'min(400px, 100%)',
      maxHeight: '100%',
      data: this.localUser.tasks[index],
      scrollStrategy: new NoopScrollStrategy(),
    });
    this._subscriptionEditDialog = editDialogRef
      .afterClosed()
      .subscribe((result) => {
        if (result && result.event == 'update') {
          this.localUser.tasks.splice(index, 1, result.data);
          this.sessionDataService.setTask(this.localUser.tasks);
        }
      });
  }

  /**
   * Reset all task status amounts
   */
  resetCount() {
    this.amountTasksAwaitFeedback =
      this.amountTasksDone =
      this.amountTasksInProgress =
      this.amountTasksTodo =
        0;
  }

  /**
   * Count task status amount, used for hide the label in the columns
   */
  countTaskStatus() {
    this.resetCount();
    this.localUser.tasks.forEach((element) => {
      if (element.status == 'toDo') this.amountTasksTodo++;
      if (element.status == 'awaitFeedback') this.amountTasksAwaitFeedback++;
      if (element.status == 'inProgress') this.amountTasksInProgress++;
      if (element.status == 'done') this.amountTasksDone++;
    });
  }

  drag(event: CdkDragStart<string[]>, task: Task) {
    this.rotateValue = 5;
    this.dragableTask = task;
    this.hideGhostCard.forEach((v, i, a) => (a[i] = false));
  }

  /**
   * When moving card to column, the ghost card will be hide.
   * @param event CdkDragEnter
   */
  resetGhostCard(event: CdkDragEnter<string[]>) {
    switch (event.container.data[0]) {
      case 'toDo':
        this.setCardLabel(0);
        break;
      case 'inProgress':
        this.setCardLabel(1);
        break;
      case 'awaitFeedback':
        this.setCardLabel(2);
        break;
      case 'done':
        this.setCardLabel(3);
        break;
    }
  }

  /**
   * When the card is leaving the column, the ghost card will be shown.
   * @param event CdkDragExit
   */
  setGhostCard(event: CdkDragExit<string[]>) {
    switch (event.container.data[0]) {
      case 'toDo':
        this.resetCardLabel(0);
        break;
      case 'inProgress':
        this.resetCardLabel(1);
        break;
      case 'awaitFeedback':
        this.resetCardLabel(2);
        break;
      case 'done':
        this.resetCardLabel(3);
        break;
    }
  }

  /**
   * Set ghost card and label to true, to hide them, depends of column index.
   * @param number index of column
   */
  setCardLabel(number: number) {
    this.hideGhostCard[number] = true;
    this.hideLabel[number] = true;
  }

  /**
   * Set ghost card and label to false, to show them, depends of column index.
   * @param number index of column
   */
  resetCardLabel(number: number) {
    this.hideGhostCard[number] = false;
    this.hideLabel[number] = false;
  }

  /**
   * Drop the card in column. Update status and save in database.
   * @param event CdkDragDrop
   */
  drop(event: CdkDragDrop<string[]>) {
    let column = event.container.data[0];
    this.hideGhostCard.forEach((v, i, a) => (a[i] = true));
    this.hideLabel.forEach((v, i, a) => (a[i] = false));
    this.rotateValue = 0;

    if (event.previousContainer !== event.container) {
      this.localUser.tasks.forEach((task) => {
        if (task == this.dragableTask) {
          if (
            column == 'toDo' ||
            column == 'inProgress' ||
            column == 'awaitFeedback' ||
            column == 'done'
          ) {
            task.status = column;
            this.updateTaskStatus();
          }
        }
      });
    }
  }

  /**
   * Opens a MatDialog to add a new Task.
   * @param status status where the new task will be added
   */
  openAddTaskDialog(status: 'toDo' | 'inProgress' | 'awaitFeedback' | 'done') {
    this.sessionDataService.reqTaskStatus = status;
    const addDialogRef = this.dialog.open(AddTaskComponent, {
      minWidth: 'min(400px, 100vw)',
      maxWidth: '100vw',
      maxHeight: '90%',
      panelClass: 'addtaskPopup',
      scrollStrategy: new NoopScrollStrategy(),
    });
    this._subscriptionAddDialog = addDialogRef
      .afterClosed()
      .subscribe((result) => {
        this.sessionDataService.reqTaskStatus = 'toDo';
      });
  }

  /**
   * Router Link to add Task page. Preset the status.
   * @param status status where a new task will be added
   */
  linkToAddTask(status: 'toDo' | 'inProgress' | 'awaitFeedback' | 'done') {
    this.sessionDataService.reqTaskStatus = status;
    this.router.navigate(['addtask/' + this.docId]);
  }

  /**
   * Save the updated tasks in the database
   */
  updateTaskStatus() {
    this.sessionDataService.setTask(this.localUser.tasks);
  }

  /**
   * Filter the tasks when the input field is filled. If a task title or description is found, push the taskId to an array.
   * This is used to lower the opactity of the task cards which are not found. The other stay with high opacity.
   */
  filterTask() {
    if (this.searchInput) {
      this.filteredTasks = [];
      this.filterActive = true;
      this.localUser.tasks.forEach((task) => {
        if (
          task.title.toLowerCase().includes(this.searchInput.toLowerCase()) ||
          task.description
            .toLowerCase()
            .includes(this.searchInput.toLowerCase())
        ) {
          this.filteredTasks.push(task.taskID);
        }
      });
    } else this.filterActive = false;
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.checkMobile();
  }

  /**
   * Check if the page is in mobile mode. Close details if not.
   */
  checkMobile() {
    let width = window.innerWidth;
    this.mobileMode = width <= 950 ? true : false;
  }
}
