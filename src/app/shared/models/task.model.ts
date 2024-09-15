import { Contact } from '../../interfaces/contact.interface';
import { Subtask } from '../../interfaces/subtask.interface';

export class TaskObject {
  public title: string | null;
  public description: string | null;
  public assignedContacts: Contact[];
  public priority: string | null;
  public category: string | null;
  public dueDate: string | null;
  public status: string | null;
  public subtasks: Subtask[];

  constructor(
    title: string | null,
    description: string | null,
    assignedContacts: Contact[],
    priority: string | null,
    category: string | null,
    dueDate: string | null,
    status: string | null,
    subtasks: Subtask[]
  ) {
    this.title = title;
    this.description = description;
    this.assignedContacts = assignedContacts;
    this.priority = priority;
    this.category = category;
    this.priority = priority;
    this.dueDate = dueDate;
    this.status = status;
    this.subtasks = subtasks;
  }
}
