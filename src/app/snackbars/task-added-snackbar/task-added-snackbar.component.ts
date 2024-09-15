import { Component, ViewEncapsulation } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-task-added-snackbar',
  standalone: true,
  imports: [],
  templateUrl: './task-added-snackbar.component.html',
  styleUrl: './task-added-snackbar.component.scss',
})
export class TaskAddedSnackbarComponent {
  constructor() {}
}
