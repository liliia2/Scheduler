import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, mergeMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { SettingsGet } from '../../models/settings';
import { SettingsService } from '../../services/setting.service';
import {
    ESettingsActions,
    LoadSettings,
    LoadSettingsSuccess,
    LoadSettingsFail,
    UpdateSettings,
    UpdateSettingsSuccess,
    UpdateSettingsFail
} from '../actions/settings.actions';

@Injectable()
export class SettingsEffects {
    @Effect()
    loadSettings$ = this.actions$.pipe(
        ofType<LoadSettings>(ESettingsActions.LOAD_SETTINGS),
        switchMap(() => this.settingsService.getSettings()),
        switchMap((settings: SettingsGet) => {
            const result = JSON.parse(settings.data);
            return of(new LoadSettingsSuccess(result));
        }),
        catchError((error) => {
            return of(new LoadSettingsFail(error));
        })
    );

    @Effect()
    updateSettings$ = this.actions$.pipe(
        ofType<UpdateSettings>(ESettingsActions.UPDATE_SETTINGS),
        switchMap(action => {
            return this.settingsService.updateSettings(action.payload).pipe(
                mergeMap((settings: SettingsGet) => {
                    const result = JSON.parse(settings.data);
                    return of(new UpdateSettingsSuccess(result));
                }),
                catchError((error) => {
                    return of(new UpdateSettingsFail(error));
                })
            );
        })
    );

    constructor(
        private settingsService: SettingsService,
        private actions$: Actions
    ) {}
}
