import { ITask, TasksGet } from 'src/app/models/task';

export interface ITasksState {
    tasks: ITask[];
    // selectedTask: ITask;
    loading: boolean;
    error: Error;
}

export const initialTasksState: ITasksState = {
    tasks: null,
    // selectedTask: null,
    loading: false,
    error: null
};
