import { IUser } from 'src/app/models/user';

export interface IUsersState {
    users: IUser[];
    loading: boolean;
    error: Error;
}

export const initialUsersState: IUsersState = {
    users: null,
    loading: false,
    error: null
};
