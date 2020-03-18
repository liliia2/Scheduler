import { Action } from '@ngrx/store';

import { ISettings, SettingsGet } from '../../models/settings';

export enum ESettingsActions {
  LOAD_SETTINGS = '[SETTINGS] Load Settings',
  LOAD_SETTINGS_SUCCESS = '[SETTINGS] Load Settings Success',
  LOAD_SETTINGS_FAIL = '[SETTINGS] Load Settings Fail',

  UPDATE_SETTINGS = '[SETTINGS] Update Settings',
  UPDATE_SETTINGS_SUCCESS = '[SETTINGS] Update Settings Success',
  UPDATE_SETTINGS_FAIL = '[SETTINGS] Update Settings Fail'
}

export class LoadSettings implements Action {
  readonly type = ESettingsActions.LOAD_SETTINGS;
  constructor() { }
}

export class LoadSettingsSuccess implements Action {
  readonly type = ESettingsActions.LOAD_SETTINGS_SUCCESS;
  constructor(public payload: ISettings) { }
}

export class LoadSettingsFail implements Action {
  readonly type = ESettingsActions.LOAD_SETTINGS_FAIL;
  constructor(public payload: Error) { }
}

export class UpdateSettings implements Action {
  readonly type = ESettingsActions.UPDATE_SETTINGS;
  constructor(public payload: ISettings) { }
}

export class UpdateSettingsSuccess implements Action {
  readonly type = ESettingsActions.UPDATE_SETTINGS_SUCCESS;
  constructor(public payload: ISettings) { }
}

export class UpdateSettingsFail implements Action {
  readonly type = ESettingsActions.UPDATE_SETTINGS_FAIL;
  constructor(public payload: Error) { }
}

export type SettingsActions =
  | LoadSettings
  | LoadSettingsSuccess
  | LoadSettingsFail
  | UpdateSettings
  | UpdateSettingsSuccess
  | UpdateSettingsFail;
