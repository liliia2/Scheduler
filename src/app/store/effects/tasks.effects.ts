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
    // UpdateTask,
    // UpdateTaskSuccess,
    // UpdateTaskFail
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

    // @Effect()
    // updateTask$ = this.actions$.pipe(
    //     ofType<UpdateTask>(ETasksActions.UPDATE_TASK),
    //     switchMap(action => {
    //         // console.log('Update task in updateTask effects', action);
    //         return this.tasksService.updateTask(action.payload).pipe(
    //             mergeMap(x => {
    //                 console.log('Update tasks in effects', x);
    //                 return of(new UpdateTaskSuccess(x));
    //             }),
    //             catchError((error) => {
    //                 console.log('Update Error tasks in effects', error);
    //                 return of(error);
    //             })
    //         );
    //     })
    // );

    constructor(
        private tasksService: TasksService,
        private actions$: Actions
    ) { }
}
