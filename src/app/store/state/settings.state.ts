import { ISettings } from 'src/app/models/settings';

export interface ISettingsState {
    settings: ISettings;
    loading: boolean;
    error: Error;
}

export const initialSettingsState: ISettingsState = {
    settings: null,
    loading: false,
    error: null
};
