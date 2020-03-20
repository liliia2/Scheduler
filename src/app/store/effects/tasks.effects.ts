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
    UpdateTask,
    UpdateTaskSuccess,
    UpdateTaskFail
} from '../actions/tasks.actions';

@Injectable()
export class TasksEffects {
    @Effect()
    loadTasks$ = this.actions$.pipe(
        ofType<LoadTasks>(ETasksActions.LOAD_TASKS),
        switchMap(() => this.tasksService.getTasks()),
        switchMap((tasks: ITask[]) => {
            return of(new LoadTasksSuccess(tasks));
        })
    );

    @Effect()
    updateTask$ = this.actions$.pipe(
        ofType<UpdateTask>(ETasksActions.UPDATE_TASK),
        switchMap(action => {
            console.log('Update Task in UpdateTask effects', action);
            return this.tasksService.updateTask(action.payload).pipe(
                mergeMap(x => {
                    console.log('Update Task in effects', x);
                    return of(new UpdateTaskSuccess(x));
                }),
                catchError((error) => {
                    console.log('Update Task Error  in effects', error);
                    return of(new UpdateTaskFail(error));
                })
            );
        })
    );

    constructor(
        private tasksService: TasksService,
        private actions$: Actions
    ) { }
}
