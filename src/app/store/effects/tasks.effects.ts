import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, mergeMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { ITask, TasksGet } from '../../models/task';
import { TasksService } from '../../services/tasks.service';
import {
    ETasksActions,
    LoadTasks,
    LoadTasksSuccess,
    LoadTasksFail,
    UpdateTasks,
    UpdateTasksSuccess,
    UpdateTasksFail
} from '../actions/tasks.actions';

@Injectable()
export class TasksEffects {
    @Effect()
    loadTasks$ = this.actions$.pipe(
        ofType<LoadTasks>(ETasksActions.LOAD_TASKS),
        switchMap(() => this.tasksService.getTasks()),
        switchMap((tasks: TasksGet) => {
            const result = JSON.parse(tasks.data);
            return of(new LoadTasksSuccess(result));
        })
    );

    @Effect()
    updateTasks$ = this.actions$.pipe(
        ofType<UpdateTasks>(ETasksActions.UPDATE_TASKS),
        switchMap(action => {
            return this.tasksService.updateTasks(action.payload).pipe(
                mergeMap((tasks: TasksGet) => {
                    const result = JSON.parse(tasks.data);
                    return of(new UpdateTasksSuccess(result));
                }),
                catchError((error) => {
                    return of(new UpdateTasksFail(error));
                })
            );
        })
    );

    constructor(
        private tasksService: TasksService,
        private actions$: Actions
    ) { }
}
