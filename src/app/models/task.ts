import { IUser } from 'src/app/models/user';

export interface TasksGet {
  success: boolean;
  data: Tasks;
}

export interface Tasks {
  tasks: ITask[];
}

export interface ITask {
  id: number;
  taskStart: number;
  taskEnd: number;
  type: string;
  title: string;
  description: string;
  responsibleUser: IUser;
}
