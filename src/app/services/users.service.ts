import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { IUser } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  key = '$2b$10$IvNEJpkMEyo3Zat95ohKdem5ykpjDaE523MDuAuQUN3aeW0QtuagS';

  constructor(private http: HttpClient) { }

  getUsers(): Observable<IUser[]> {
    const headers = new HttpHeaders().set('secret-key', this.key);
    return this.http.get<IUser[]>(
      'https://api.jsonbin.io/b/5e9476921452b34da0fe89e5/latest',
      { headers }
    );
  }

}
