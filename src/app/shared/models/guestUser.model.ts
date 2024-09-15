import { Contact } from '../../interfaces/contact.interface';
import { Task } from '../../interfaces/task.interface';
import { User } from '../../interfaces/user.interface';

export class Guest implements User {
  public name: string;
  public email: string;
  public userinitials: string;
  public contacts: Contact[];
  public id?: string | undefined;
  public password: string;
  public tasks: Task[];

  constructor(name: string, email: string, initials: string, password: string) {
    (this.name = name),
      (this.email = email),
      (this.userinitials = initials),
      (this.password = password),
      (this.contacts = [
        {
          contactID: '1',
          badgecolor: '#1FD7C1',
          initials: 'RS',
          register: 'R',
          name: 'Rainer Sonnenschein',
          email: 'sonnenschein@draussen.de',
          phone: '+49 30 5678 9456',
          selected: false,
        },
        {
          contactID: '2',
          badgecolor: '#00BEE8',
          initials: 'PN',
          register: 'P',
          name: 'Pia Nist',
          email: 'musikerin@mitherz.de',
          phone: '+49 221 3456412',
          selected: false,
        },
        {
          contactID: '3',
          badgecolor: '#FFA35E',
          initials: 'AF',
          register: 'A',
          name: 'Arne Fröhlich',
          email: 'froehlich@24-7.com',
          phone: '+49 815 79183212',
          selected: false,
        },
        {
          contactID: '4',
          badgecolor: '#FFA35E',
          initials: 'KE',
          register: 'K',
          name: 'Karl Ender',
          email: 'karlender@datum.com',
          phone: '+49 711 3652987',
          selected: false,
        },
        {
          contactID: '5',
          badgecolor: '#FF745E',
          initials: 'KH',
          register: 'K',
          name: 'Klara Himmel',
          email: 'gerne@sommer.de',
          phone: '+49 123 456 789',
          selected: false,
        },
        {
          contactID: '6',
          badgecolor: '#00BEE8',
          initials: 'CK',
          register: 'C',
          name: 'Christiane Krise',
          email: 'krise@serveranbindung.de',
          phone: '+49 221 3456413',
          selected: false,
        },
        {
          contactID: '7',
          badgecolor: '#FF7A00',
          initials: 'JD',
          register: 'J',
          name: 'John Doe',
          email: 'john.doe@example.com',
          phone: '835769376',
          selected: false,
        },
        {
          contactID: '8',
          badgecolor: '#FF5EB3',
          initials: 'AS',
          register: 'A',
          name: 'Alice Smith',
          email: 'alice.smith@example.com',
          phone: '835769377',
          selected: false,
        },
        {
          contactID: '9',
          badgecolor: '#6E52FF',
          initials: 'MP',
          register: 'M',
          name: 'Michael Phillips',
          email: 'michael.phillips@example.com',
          phone: '835769378',
          selected: false,
        },
        {
          contactID: '10',
          badgecolor: '#9327FF',
          initials: 'EK',
          register: 'E',
          name: 'Emily King',
          email: 'emily.king@example.com',
          phone: '835769379',
          selected: false,
        },
      ]),
      (this.tasks = [
        {
          title: 'Create Landing Page Design',
          taskID: '123456',
          description: 'Design a captivating landing page for the new website.',
          assignedContacts: [
            {
              contactID: '5',
              badgecolor: '#FF745E',
              initials: 'KH',
              register: 'K',
              name: 'Klara Himmel',
              email: 'gerne@sommer.de',
              phone: '+49 123 456 789',
              selected: true,
            },
            {
              contactID: '6',
              badgecolor: '#00BEE8',
              initials: 'CK',
              register: 'C',
              name: 'Christiane Krise',
              email: 'krise@serveranbindung.de',
              phone: '+49 221 3456413',
              selected: true,
            },
          ],
          priority: 'urgent',
          category: 'Technical Task',
          dueDate: '2024-07-28',
          status: 'inProgress',
          subtasks: [
            { title: 'Draft initial concepts', done: false },
            { title: 'Gather feedback from stakeholders', done: false },
          ],
        },
        {
          title: 'Develop User Registration Feature',
          taskID: '954782',
          description:
            'Implement user registration functionality for the website.',
          assignedContacts: [
            {
              contactID: '7',
              badgecolor: '#FF7A00',
              initials: 'JD',
              register: 'J',
              name: 'John Doe',
              email: 'john.doe@example.com',
              phone: '835769376',
              selected: true,
            },
            {
              contactID: '8',
              badgecolor: '#FF5EB3',
              initials: 'AS',
              register: 'A',
              name: 'Alice Smith',
              email: 'alice.smith@example.com',
              phone: '835769377',
              selected: true,
            },
          ],
          priority: 'medium',
          category: 'Technical Task',
          dueDate: '2024-07-15',
          status: 'toDo',
          subtasks: [
            { title: 'Design database schema', done: false },
            { title: 'Write backend code', done: false },
          ],
        },
        {
          title: 'Write About Us Page Content',
          taskID: '234567',
          description: 'Craft engaging content for the About Us page.',
          assignedContacts: [
            {
              contactID: '10',
              badgecolor: '#9327FF',
              initials: 'EK',
              register: 'E',
              name: 'Emily King',
              email: 'emily.king@example.com',
              phone: '835769379',
              selected: true,
            },
          ],
          priority: 'low',
          category: 'User Story',
          dueDate: '2024-04-12',
          status: 'done',
          subtasks: [],
        },
        {
          title: 'Optimize Website Performance',
          taskID: '345678',
          description:
            'Identify and fix performance bottlenecks on the website.',
          assignedContacts: [
            {
              contactID: '9',
              badgecolor: '#6E52FF',
              initials: 'MP',
              register: 'M',
              name: 'Michael Phillips',
              email: 'michael.phillips@example.com',
              phone: '835769378',
              selected: true,
            },
            {
              contactID: '4',
              badgecolor: '#FFA35E',
              initials: 'KE',
              register: 'K',
              name: 'Karl Ender',
              email: 'karlender@datum.com',
              phone: '+49 711 3652987',
              selected: true,
            },
          ],
          priority: 'urgent',
          category: 'Technical Task',
          dueDate: '2024-08-20',
          status: 'awaitFeedback',
          subtasks: [
            { title: 'Conduct performance analysis', done: true },
            { title: 'Implement optimizations', done: false },
          ],
        },
        {
          title: 'Create Contact Form Feature',
          taskID: '456789',
          description: 'Build a contact form for user inquiries.',
          assignedContacts: [
            {
              contactID: '3',
              badgecolor: '#FFA35E',
              initials: 'AF',
              register: 'A',
              name: 'Arne Fröhlich',
              email: 'fröhlich@24-7.com',
              phone: '+49 815 79183212',
              selected: true,
            },
            {
              contactID: '7',
              badgecolor: '#FF7A00',
              initials: 'JD',
              register: 'J',
              name: 'John Doe',
              email: 'john.doe@example.com',
              phone: '835769376',
              selected: true,
            },
          ],
          priority: 'medium',
          category: 'Technical Task',
          dueDate: '2024-06-18',
          status: 'inProgress',
          subtasks: [
            { title: 'Design form layout', done: true },
            { title: 'Implement form validation', done: false },
          ],
        },
      ]);
  }

  public toJSON() {
    return {
      name: this.name,
      email: this.email,
      userinitials: this.userinitials,
      password: this.password,
      contacts: this.contacts,
      tasks: this.tasks,
    };
  }
}
