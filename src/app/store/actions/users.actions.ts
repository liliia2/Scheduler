import { Action } from '@ngrx/store';

import { IUser, UsersGet } from '../../models/user';

export enum EUsersActions {
  LOAD_USERS = '[USERS] Load Users',
  LOAD_USERS_SUCCESS = '[USERS] Load Users Success',
  LOAD_USERS_FAIL = '[USERS] Load Users Fail',
}

export class LoadUsers implements Action {
  readonly type = EUsersActions.LOAD_USERS;
  constructor() { }
}

export class LoadUsersSuccess implements Action {
  readonly type = EUsersActions.LOAD_USERS_SUCCESS;
  constructor(public payload: IUser[]) { }
}

export class LoadUsersFail implements Action {
  readonly type = EUsersActions.LOAD_USERS_FAIL;
  constructor(public payload: Error) { }
}

export type UsersActions =
  | LoadUsers
  | LoadUsersSuccess
  | LoadUsersFail;
