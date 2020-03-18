import { IUser, UsersGet } from 'src/app/models/user';

export interface IUsersState {
    users: IUser[];
    // selectedUser: IUser;
    loading: boolean;
    error: Error;
}

export const initialUsersState: IUsersState = {
    users: null,
    // selectedUser: null,
    loading: false,
    error: null
};
