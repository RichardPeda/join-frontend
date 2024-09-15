import { Component, HostListener, inject } from '@angular/core';
import { NavbarComponent } from '../shared/modules/navbar/navbar.component';
import { HeaderComponent } from '../shared/modules/header/header.component';
import { CommonModule } from '@angular/common';
import { UserdataService } from '../services/userdata.service';
import { User } from '../interfaces/user.interface';
import { SessiondataService } from '../services/sessiondata.service';
import { Task } from '../interfaces/task.interface';
import { GreetingAnimationComponent } from '../greeting-animation/greeting-animation.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [
    NavbarComponent,
    HeaderComponent,
    CommonModule,
    GreetingAnimationComponent,
  ],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss',
})
export class SummaryComponent {
  _subscriptionUser: any;
  localUser: User = {
    id: '',
    name: '',
    userinitials: '',
    email: '',
    password: '',
    contacts: [],
    tasks: [],
  };
  setImg = false;
  name = '';
  greeting = 'Hello';
  date = '';
  currentTimestamp = 0;
  docId = '';
  nrOfTasks = [
    {
      status: 'toDo',
      amount: 0,
    },
    {
      status: 'inProgress',
      amount: 0,
    },
    {
      status: 'awaitFeedback',
      amount: 0,
    },
    {
      status: 'done',
      amount: 0,
    },
  ];

  taskHighestPriorityArray: Task[] = [];
  deadline = '';
  mobileMode = false;

  nrTasksInBoard = 0;
  nrTasksUrgent = 0;

  penImgSrc = [
    '../../assets/img/pencil-dark.svg',
    '../../assets/img/pencil-white-r.svg',
  ];
  doneImgSrc = [
    '../../assets/img/done-dark.svg',
    '../../assets/img/done-white.svg',
  ];
  penImgIdx = 0;
  doneImgIdx = 0;
  name$: any;

  sessionDataService = inject(SessiondataService);

  constructor(private userService: UserdataService, private router: Router) {
    this.docId = this.userService.loadIdFromSessionStorage()!;
  }

  ngOnInit() {
       this._subscriptionUser = this.sessionDataService.userSubject.subscribe(
      (user: User) => {
        this.localUser = user;
        this.greeting = this.greetingDay(this.localUser.name);
        this.name = this.localUser.name;

        if (user) {
          this.nrOfTasks.forEach((element) => {
            element.amount = this.countTasksOfStatus(element.status);
          });
          this.nrTasksInBoard = this.countAllTasks();
          this.getHighestPriority();
          this.deadline = this.getDeadline();
        }
      }
    );
    this.checkMobile();
    this.mobileGreeting();
  }

  ngOnDestroy() {
    this._subscriptionUser.unsubscribe();
  }

  /**
   * Change the image of the card
   * @param name name of the image
   */
  changeImg(name: 'pencil' | 'done') {
    name === 'pencil' ? (this.penImgIdx = 1) : (this.doneImgIdx = 1);
  }

  /**
   * Reset the image of the card
   * @param name name of the image
   */
  resetImg(name: 'pencil' | 'done') {
    name === 'pencil' ? (this.penImgIdx = 0) : (this.doneImgIdx = 0);
  }

  /**
   * This function returns a greeting depending of the actual time.
   * @param name username
   * @returns greeting string
   */
  greetingDay(name: string): string {
    const currentTime = new Date();
    this.getFullDate(currentTime);
    const currentHour = currentTime.getHours();
    let letter = name == 'guest' ? '!' : ',';

    if (currentHour < 12) {
      return 'Good morning' + letter;
    } else if (currentHour < 18) {
      return 'Good day' + letter;
    } else {
      return 'Good evening' + letter;
    }
  }

  /**
   * This function get the actual full date.
   * @param time current time
   */
  getFullDate(time: Date) {
    let date = time.toISOString();
    date = date.slice(0, 10);
    this.currentTimestamp = Date.parse(date);
  }

  /**
   * This function returns the actual timestamp.
   * @param time current time
   * @returns timestamp
   */
  getTimestamp(time: string): number {
    let date = time.slice(0, 10);
    return Date.parse(date);
  }

 /**
  * This function returns a number depending on the amount of task status.
  * @param status task status - todo, await feedback, in progress
  * @returns amount of task depending of status
  */
  countTasksOfStatus(status: string): number {
    let num = 0;
    if (this.localUser.tasks) {
      this.localUser.tasks.forEach((task) => {
        if (task.status === status) num++;
      });
    }
    return num;
  }

  /**
   * Returns the amount of all tasks for the number of task in board.
   * @returns amount of all tasks
   */
  countAllTasks(): number {
    let num = 0;
    if (this.localUser.tasks) {
      this.localUser.tasks.forEach((task) => {
        num++;
      });
    }
    return num;
  }

  /**
   * Search all task for highest Priority
   */
  getHighestPriority() {
    if (this.localUser.tasks) {
      this.localUser.tasks.forEach((task) => {
        if (task.priority === 'urgent') {
          this.taskHighestPriorityArray.push(task);
        }
      });
    }
  }

  /**
   * This function checks all urgent tasks and return the next deadline as date.
   * @returns a date string in US format
   */
  getDeadline() {
    let difference = 99999999999999;
    let date = '';

    this.taskHighestPriorityArray.forEach((task) => {
      if (
        difference >=
        this.getTimestamp(task.dueDate) - this.currentTimestamp
      ) {
        difference = this.getTimestamp(task.dueDate) - this.currentTimestamp;
        date = task.dueDate;
      }
    });
    let newDate = new Date(date);

    const formattedDate = newDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    return formattedDate;
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.checkMobile();
  }

  /**
   * Check if the page is in mobile mode smaller 1200px.
   */
  checkMobile() {
    let width = window.innerWidth;
    this.mobileMode = width <= 1200 ? true : false;
    this.mobileGreeting()
  }

  /**
   * In mobile mode show the mobile greeting component.
   */
  mobileGreeting() {
    if (this.mobileMode && this.sessionDataService.fadeout == 'show') {
      setTimeout(() => {
        this.sessionDataService.fadeout = 'hide';
      }, 1500);
    }
  }

  /**
   * Routerlink to the board page.
   */
  linkToBoard() {
    this.router.navigate(['board/' + this.docId]);
  }
}
