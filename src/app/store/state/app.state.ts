import { RouterReducerState } from '@ngrx/router-store';
import { initialSettingsState, ISettingsState } from './settings.state';
import { initialUsersState, IUsersState } from './users.state';
import { initialTasksState, ITasksState } from './tasks.state';

export interface IAppState {
  router?: RouterReducerState;
  settings: ISettingsState;
  tasks: ITasksState;
  users?: IUsersState;
}

export const initialAppState: IAppState = {
  settings: initialSettingsState,
  tasks: initialTasksState,
  users: initialUsersState
};

export function getInitialState(): IAppState {
  return initialAppState;
}
