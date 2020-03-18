import { Action } from '@ngrx/store';

import { ITask, TasksGet } from '../../models/task';

export enum ETasksActions {
  LOAD_TASKS = '[TASKS] Load Tasks',
  LOAD_TASKS_SUCCESS = '[TASKS] Load Tasks Success',
  LOAD_TASKS_FAIL = '[TASKS] Load Tasks Fail',

  // ADD_TASK = '[TASKS] Add Task',
  // ADD_TASK_SUCCESS = '[TASKS] Add Task Success',
  // ADD_TASK_FAIL = '[TASKS] Add Task Fail',

  // UPDATE_TASK = '[TASK] Update Task',
  // UPDATE_TASK_SUCCESS = '[TASK] Update Task Success',
  // UPDATE_TASK_FAIL = '[TASK] Update Task Fail'
}

export class LoadTasks implements Action {
  readonly type = ETasksActions.LOAD_TASKS;
  constructor() { }
}

export class LoadTasksSuccess implements Action {
  readonly type = ETasksActions.LOAD_TASKS_SUCCESS;
  constructor(public payload: ITask[]) { }
}

export class LoadTasksFail implements Action {
  readonly type = ETasksActions.LOAD_TASKS_FAIL;
  constructor(public payload: Error) { }
}

// export class AddTask implements Action {
//   readonly type = ETasksActions.ADD_TASK;
//   constructor(public payload: ITask) { }
// }

// export class AddTaskSuccess implements Action {
//   readonly type = ETasksActions.ADD_TASK_SUCCESS;
//   constructor(public payload: ITask) { }
// }

// export class AddTaskFail implements Action {
//   readonly type = ETasksActions.ADD_TASK_FAIL;
//   constructor(public payload: Error) { }
// }

// export class UpdateTask implements Action {
//   readonly type = ETasksActions.UPDATE_TASK;
//   constructor(public payload: ITask) { }
// }

// export class UpdateTaskSuccess implements Action {
//   readonly type = ETasksActions.UPDATE_TASK_SUCCESS;
//   constructor(public payload: ITask) { }
// }

// export class UpdateTaskFail implements Action {
//   readonly type = ETasksActions.UPDATE_TASK_FAIL;
//   constructor(public payload: Error) { }
// }

export type TasksActions =
  | LoadTasks
  | LoadTasksSuccess
  | LoadTasksFail
  // | AddTask
  // | AddTaskSuccess
  // | AddTaskFail
  // | UpdateTask
  // | UpdateTaskSuccess
  // | UpdateTaskFail
  ;
