import { createSelector } from '@ngrx/store';

import { IAppState } from '../state/app.state';
import { ISettingsState } from '../state/settings.state';

const settingsState = (state: IAppState) => state.settings;

export const selectSettings = createSelector(
    settingsState,
    (state: ISettingsState) => state.settings
);
