import { TasksActions, ETasksActions } from '../actions/tasks.actions';
import { initialTasksState, ITasksState } from './../state/tasks.state';

export function tasksReducers(
    state: ITasksState = initialTasksState,
    action: TasksActions
) {
    switch (action.type) {
        case ETasksActions.LOAD_TASKS: {
            return {
                ...state,
                tasks: null
            };
        }
        case ETasksActions.LOAD_TASKS_SUCCESS: {
            return {
                ...state,
                tasks: action.payload,
                loading: true
            };
        }
        case ETasksActions.LOAD_TASKS_FAIL: {
            return {
                ...state,
                error: action.payload,
                loading: false
            };
        }
        case ETasksActions.UPDATE_TASKS: {
            return {
                ...state,
                tasks: null
            };
        }
        case ETasksActions.UPDATE_TASKS_SUCCESS: {
            return {
                ...state,
                tasks: action.payload,
                loading: true
            };
        }
        case ETasksActions.UPDATE_TASKS_FAIL: {
            return {
                ...state,
                error: action.payload,
                loading: false
            };
        }
        default:
            return state;
    }
}
