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
          id: '1',
          badge_color: '#1FD7C1',
          initials: 'RS',
          register: 'R',
          name: 'Rainer Sonnenschein',
          email: 'sonnenschein@draussen.de',
          phone: '+49 30 5678 9456',
          selected: false,
        },
        {
          id: '2',
          badge_color: '#00BEE8',
          initials: 'PN',
          register: 'P',
          name: 'Pia Nist',
          email: 'musikerin@mitherz.de',
          phone: '+49 221 3456412',
          selected: false,
        },
        {
          id: '3',
          badge_color: '#FFA35E',
          initials: 'AF',
          register: 'A',
          name: 'Arne Fröhlich',
          email: 'froehlich@24-7.com',
          phone: '+49 815 79183212',
          selected: false,
        },
        {
          id: '4',
          badge_color: '#FFA35E',
          initials: 'KE',
          register: 'K',
          name: 'Karl Ender',
          email: 'karlender@datum.com',
          phone: '+49 711 3652987',
          selected: false,
        },
        {
          id: '5',
          badge_color: '#FF745E',
          initials: 'KH',
          register: 'K',
          name: 'Klara Himmel',
          email: 'gerne@sommer.de',
          phone: '+49 123 456 789',
          selected: false,
        },
        {
          id: '6',
          badge_color: '#00BEE8',
          initials: 'CK',
          register: 'C',
          name: 'Christiane Krise',
          email: 'krise@serveranbindung.de',
          phone: '+49 221 3456413',
          selected: false,
        },
        {
          id: '7',
          badge_color: '#FF7A00',
          initials: 'JD',
          register: 'J',
          name: 'John Doe',
          email: 'john.doe@example.com',
          phone: '835769376',
          selected: false,
        },
        {
          id: '8',
          badge_color: '#FF5EB3',
          initials: 'AS',
          register: 'A',
          name: 'Alice Smith',
          email: 'alice.smith@example.com',
          phone: '835769377',
          selected: false,
        },
        {
          id: '9',
          badge_color: '#6E52FF',
          initials: 'MP',
          register: 'M',
          name: 'Michael Phillips',
          email: 'michael.phillips@example.com',
          phone: '835769378',
          selected: false,
        },
        {
          id: '10',
          badge_color: '#9327FF',
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
          id: '123456',
          description: 'Design a captivating landing page for the new website.',
          contacts: [
            {
              id: '5',
              badge_color: '#FF745E',
              initials: 'KH',
              register: 'K',
              name: 'Klara Himmel',
              email: 'gerne@sommer.de',
              phone: '+49 123 456 789',
              selected: true,
            },
            {
              id: '6',
              badge_color: '#00BEE8',
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
          due_date: '2024-07-28',
          status: 'inProgress',
          related_task: [
            { title: 'Draft initial concepts', done: false },
            { title: 'Gather feedback from stakeholders', done: false },
          ],
        },
        {
          title: 'Develop User Registration Feature',
          id: '954782',
          description:
            'Implement user registration functionality for the website.',
          contacts: [
            {
              id: '7',
              badge_color: '#FF7A00',
              initials: 'JD',
              register: 'J',
              name: 'John Doe',
              email: 'john.doe@example.com',
              phone: '835769376',
              selected: true,
            },
            {
              id: '8',
              badge_color: '#FF5EB3',
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
          due_date: '2024-07-15',
          status: 'toDo',
          related_task: [
            { title: 'Design database schema', done: false },
            { title: 'Write backend code', done: false },
          ],
        },
        {
          title: 'Write About Us Page Content',
          id: '234567',
          description: 'Craft engaging content for the About Us page.',
          contacts: [
            {
              id: '10',
              badge_color: '#9327FF',
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
          due_date: '2024-04-12',
          status: 'done',
          related_task: [],
        },
        {
          title: 'Optimize Website Performance',
          id: '345678',
          description:
            'Identify and fix performance bottlenecks on the website.',
          contacts: [
            {
              id: '9',
              badge_color: '#6E52FF',
              initials: 'MP',
              register: 'M',
              name: 'Michael Phillips',
              email: 'michael.phillips@example.com',
              phone: '835769378',
              selected: true,
            },
            {
              id: '4',
              badge_color: '#FFA35E',
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
          due_date: '2024-08-20',
          status: 'awaitFeedback',
          related_task: [
            { title: 'Conduct performance analysis', done: true },
            { title: 'Implement optimizations', done: false },
          ],
        },
        {
          title: 'Create Contact Form Feature',
          id: '456789',
          description: 'Build a contact form for user inquiries.',
          contacts: [
            {
              id: '3',
              badge_color: '#FFA35E',
              initials: 'AF',
              register: 'A',
              name: 'Arne Fröhlich',
              email: 'fröhlich@24-7.com',
              phone: '+49 815 79183212',
              selected: true,
            },
            {
              id: '7',
              badge_color: '#FF7A00',
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
          due_date: '2024-06-18',
          status: 'inProgress',
          related_task: [
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
