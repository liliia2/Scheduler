import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, mergeMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { ISettings, SettingsGet } from '../../models/settings';
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
        switchMap((settings: ISettings) => {
            return of(new LoadSettingsSuccess(settings));
        })
    );

    @Effect()
    updateSettings$ = this.actions$.pipe(
        ofType<UpdateSettings>(ESettingsActions.UPDATE_SETTINGS),
        switchMap(action => {
            // console.log('Update settings in updateSettings effects', action);
            return this.settingsService.updateSettings(action.payload).pipe(
                mergeMap(x => {
                    console.log('Update settings in effects', x);
                    return of(new UpdateSettingsSuccess(x));
                }),
                catchError((error) => {
                    console.log('Update Error settings in effects', error);
                    return of(error);
                })
            );
            // return this.settingsService.updateSettings(action.payload)
            //     .((x) => {
            //         if (x) {
            //             console.log('Update settings in effects', x);
            //             return of(new UpdateSettingsSuccess(x));
            //         }
            //     });
        })
    );

    constructor(
        private settingsService: SettingsService,
        private actions$: Actions
    ) {}
}
