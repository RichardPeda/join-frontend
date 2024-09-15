import { Contact } from "./contact.interface"
import { Subtask } from "./subtask.interface"

export interface Task {
    taskID : string,
    title: string,
    description: string,
    assignedContacts?: Contact[],
    priority: 'urgent' | 'medium' | 'low',
    category: 'Technical Task' | 'User Story',
    dueDate: string,
    status: 'toDo' | 'inProgress' | 'awaitFeedback' | 'done',
    subtasks: Subtask[]
}




