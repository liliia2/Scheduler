import { createSelector } from '@ngrx/store';

import { IAppState } from '../state/app.state';
import { ITasksState } from '../state/tasks.state';

const selectTasks = (state: IAppState) => state.tasks;

export const selectTasksList = createSelector(
    selectTasks,
    (state: ITasksState) => state.tasks
);
