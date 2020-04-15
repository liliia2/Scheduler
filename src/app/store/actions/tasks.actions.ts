import { Action } from '@ngrx/store';

import { ITask } from '../../models/task';

export enum ETasksActions {
  LOAD_TASKS = '[TASKS] Load Tasks',
  LOAD_TASKS_SUCCESS = '[TASKS] Load Tasks Success',
  LOAD_TASKS_FAIL = '[TASKS] Load Tasks Fail',

  // ADD_TASK = '[TASKS] Add Task',
  // ADD_TASK_SUCCESS = '[TASKS] Add Task Success',
  // ADD_TASK_FAIL = '[TASKS] Add Task Fail',

  UPDATE_TASKS = '[TASK] Update Tasks',
  UPDATE_TASKS_SUCCESS = '[TASK] Update Tasks Success',
  UPDATE_TASKS_FAIL = '[TASK] Update Tasks Fail'
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

export class UpdateTasks implements Action {
  readonly type = ETasksActions.UPDATE_TASKS;
  constructor(public payload: ITask[]) { }
}

export class UpdateTasksSuccess implements Action {
  readonly type = ETasksActions.UPDATE_TASKS_SUCCESS;
  constructor(public payload: ITask[]) { }
}

export class UpdateTasksFail implements Action {
  readonly type = ETasksActions.UPDATE_TASKS_FAIL;
  constructor(public payload: Error) { }
}

export type TasksActions =
  | LoadTasks
  | LoadTasksSuccess
  | LoadTasksFail
  // | AddTask
  // | AddTaskSuccess
  // | AddTaskFail
  | UpdateTasks
  | UpdateTasksSuccess
  | UpdateTasksFail
  ;
