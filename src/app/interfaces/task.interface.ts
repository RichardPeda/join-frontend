import { Contact } from "./contact.interface"
import { Subtask } from "./subtask.interface"

export interface Task {
    id? : string,
    title: string,
    description: string,
    contacts?: Contact[],
    priority: 'urgent' | 'medium' | 'low',
    category: 'Technical Task' | 'User Story',
    due_date: string,
    status: 'toDo' | 'inProgress' | 'awaitFeedback' | 'done',
    related_task: Subtask[]
}




