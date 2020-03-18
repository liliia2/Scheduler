import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, mergeMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { IUser, UsersGet } from '../../models/user';
import { UsersService } from '../../services/users.service';
import {
    EUsersActions,
    LoadUsers,
    LoadUsersSuccess,
    LoadUsersFail
} from '../actions/users.actions';

@Injectable()
export class UsersEffects {
    @Effect()
    loadUsers$ = this.actions$.pipe(
        ofType<LoadUsers>(EUsersActions.LOAD_USERS),
        switchMap(() => this.usersService.getUsers()),
        switchMap((users: IUser[]) => {
            return of(new LoadUsersSuccess(users));
        })
    );

    constructor(
        private usersService: UsersService,
        private actions$: Actions
    ) { }
}
