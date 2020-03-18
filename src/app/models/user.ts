export interface UsersGet {
  success: boolean;
  data: IUser[];
}

export interface IUser {
  fullName: string;
  id: number;
}
