import { UsersActions, EUsersActions } from '../actions/users.actions';
import { initialUsersState, IUsersState } from './../state/users.state';

export function usersReducers(
    state: IUsersState = initialUsersState,
    action: UsersActions
) {
    switch (action.type) {
        case EUsersActions.LOAD_USERS: {
            return {
                ...state,
                users: null
            };
        }
        case EUsersActions.LOAD_USERS_SUCCESS: {
            return {
                ...state,
                users: action.payload,
                loading: true
            };
        }
        case EUsersActions.LOAD_USERS_FAIL: {
            return {
                ...state,
                error: action.payload,
                loading: false
            };
        }
        default:
            return state;
    }
}
