import { SettingsActions, ESettingsActions } from '../actions/settings.actions';
import { initialSettingsState, ISettingsState } from './../state/settings.state';

export function settingsReducers(
    state: ISettingsState = initialSettingsState,
    action: SettingsActions
) {
    switch (action.type) {
        case ESettingsActions.LOAD_SETTINGS: {
            return {
                ...state,
                settings: null
            };
        }
        case ESettingsActions.LOAD_SETTINGS_SUCCESS: {
            return {
                ...state,
                settings: action.payload,
                loading: true
            };
        }
        case ESettingsActions.LOAD_SETTINGS_FAIL: {
            return {
                ...state,
                error: action.payload,
            };
        }
        case ESettingsActions.UPDATE_SETTINGS: {
            return {
                ...state,
                settings: null
            };
        }
        case ESettingsActions.UPDATE_SETTINGS_SUCCESS: {
            return {
                ...state,
                settings: action.payload,
                loading: true
            };
        }
        case ESettingsActions.UPDATE_SETTINGS_FAIL: {
            return {
                ...state,
                error: action.payload,
            };
        }
        default:
            return state;
    }
}
