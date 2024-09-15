import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { Subtask } from '../../../interfaces/subtask.interface';
import { ClickOutsideDirective } from '../../click-outside.directive';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-subtask',
  standalone: true,
  imports: [FormsModule, ClickOutsideDirective],
  templateUrl: './subtask.component.html',
  styleUrl: './subtask.component.scss',
})
export class SubtaskComponent {
  @Input() title: string = '';
  @Output() updatedTitle = new EventEmitter<string>();

  inputData = '';
  constructor() {}

  inEditMode = false;

  @ViewChild('inputRef')
  inputRef!: ElementRef;

  @ViewChild('allComp')
  allComp!: ElementRef;

  ngOnInit() {
    this.inputData = this.title;
  }

  timeout = false;
  timeoutDisable = false;

  enableSubtask() {
    this.inEditMode = true;
    this.timeout = true;
    setTimeout(() => {
      this.timeout = false;
    }, 100);
  }

  disableSubtask() {
    if (!this.timeout) {
      this.inEditMode = false;
      if (this.inputData == '') {
        this.deleteSubtask();
      }
    }
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    let div = this.allComp.nativeElement.getBoundingClientRect();

    if (
      event.clientX < div.left ||
      event.clientX > div.right ||
      event.clientY < div.top ||
      event.clientY > div.bottom
    ) {
      this.disableSubtask();
    }
  }

  editSubtask() {
    this.enableSubtask();
    this.inputRef.nativeElement.focus();
  }

  changeTitle() {
    if (this.inputData && this.inputData != '') {
      this.updatedTitle.emit(this.inputData);
      this.disableSubtask();
    } else {
      console.log('delete');

      this.deleteSubtask();
    }
  }

  deleteSubtask() {
    this.updatedTitle.emit('');
  }
}
