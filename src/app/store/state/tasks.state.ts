import { ITask } from 'src/app/models/task';

export interface ITasksState {
    tasks: ITask[];
    loading: boolean;
    error: Error;
}

export const initialTasksState: ITasksState = {
    tasks: null,
    loading: false,
    error: null
};
