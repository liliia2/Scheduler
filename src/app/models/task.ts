import { IUser } from 'src/app/models/user';

export interface TasksGet {
  data: string;
}

export interface Tasks {
  tasks: ITask[];
}

export interface ITask {
  id: number;
  start: number;
  end: number;
  day: number;
  type: string;
  title: string;
  description: string;
  responsibleUser: IUser;
}
