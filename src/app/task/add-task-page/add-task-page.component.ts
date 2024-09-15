import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/modules/header/header.component';
import { NavbarComponent } from '../../shared/modules/navbar/navbar.component';
import { AddTaskComponent } from '../add-task/add-task.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-task-page',
  standalone: true,
  imports: [HeaderComponent, NavbarComponent, AddTaskComponent, CommonModule],
  templateUrl: './add-task-page.component.html',
  styleUrl: './add-task-page.component.scss',
})
export class AddTaskPageComponent {}
