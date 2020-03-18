import { createSelector } from '@ngrx/store';

import { IAppState } from '../state/app.state';
import { IUsersState } from '../state/users.state';

const selectUsers = (state: IAppState) => state.users;

export const selectUsersList = createSelector(
    selectUsers,
    (state: IUsersState) => state.users
);
