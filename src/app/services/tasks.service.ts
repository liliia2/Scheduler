import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { ITask, TasksGet } from '../models/task';

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  key = '$2b$10$IvNEJpkMEyo3Zat95ohKdem5ykpjDaE523MDuAuQUN3aeW0QtuagS';

  constructor(private http: HttpClient) { }

  getTasks(): Observable<TasksGet> {
    const headers = new HttpHeaders().set('secret-key', this.key);
    return this.http.get<TasksGet>(
      'https://api.jsonbin.io/b/5e9476631452b34da0fe89c4/latest',
      { headers }
    );
  }

  updateTasks(tasks: ITask[]): Observable<TasksGet> {
    const data = JSON.stringify(tasks);
    const headers = new HttpHeaders().set('secret-key', this.key);
    return this.http.put<any>(
      'https://api.jsonbin.io/b/5e9476631452b34da0fe89c4',
      { data },
      { headers }
    ).pipe(map((response) => {
      return response.data as TasksGet;
    }));
  }

}
