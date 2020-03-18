import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { IUser, UsersGet } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(private http: HttpClient) { }

  getUsers(): Observable<IUser[]> {
    return this.http.get<IUser[]>('http://localhost:3000/profiles');
    // return this.http.get<IUser[]>('https://my-json-server.typicode.com/liliia2/typicode_db/profiles');
  }

}
