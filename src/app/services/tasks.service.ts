import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { ITask, TasksGet } from '../models/task';

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  constructor(private http: HttpClient) { }

  getTasks(): Observable<ITask[]> {
    // return this.http.get<ITask[]>('https://my-json-server.typicode.com/liliia2/typicode_db/tasks?task.tasksStart_start=1588086400&task.tasksStart_end=1592086600');
    return this.http.get<ITask[]>('http://localhost:3000/tasks?task.tasksStart_start=1588086400&task.tasksStart_end=1592086600');
  }

}
