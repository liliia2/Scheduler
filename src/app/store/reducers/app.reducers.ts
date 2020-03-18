import { ActionReducerMap } from '@ngrx/store';
import { routerReducer } from '@ngrx/router-store';

import { IAppState } from '../state/app.state';
import { settingsReducers } from './settings.reducers';
import { tasksReducers } from './tasks.reducers';
import { usersReducers } from './users.reducers';

export const appReducers: ActionReducerMap<IAppState, any> = {
  router: routerReducer,
  settings: settingsReducers,
  users: usersReducers,
  tasks: tasksReducers,
};
