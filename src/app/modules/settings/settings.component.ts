import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as moment from 'moment';

import { IAppState } from 'src/app/store/state/app.state';
import { ISettings } from 'src/app/models/settings';
import { LoadSettings, UpdateSettings } from 'src/app/store/actions/settings.actions';
import { selectSettings } from 'src/app/store/selectors/settings.selector';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();
  settings: ISettings;
  startTime: Date;
  endTime: Date;
  daysOfWeek: Array<string>;
  firstWeekDay: string;
  startWeek: number;
  workingDays: Array<number>;
  startHour: string;
  endHour: string;
  lang: string;
  varStartHours: Array<string>;
  varEndHours: Array<string>;
  editMode: boolean;

  constructor(
    private store: Store<IAppState>
  ) {
    this.subscription = this.store.select(selectSettings).subscribe(result => {
      if (result && !this.settings) {
        this.settings = result;
        this.setValue();
      }
    });
  }

  ngOnInit() {
    if (!this.settings) {
      this.store.dispatch(new LoadSettings());
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  setValue() {
    this.editMode = false;
    this.startWeek = this.settings.startWeek;
    this.workingDays = this.settings.workingDays;
    this.startHour = this.settings.startHour;
    this.endHour = this.settings.endHour;
    this.lang = this.settings.lang;
    this.getDaysOfWeek();
    this.varStartHours = this.getStartHours();
    this.varEndHours = this.getEndHours();
  }

  getDaysOfWeek() {
    moment.locale(this.lang);
    this.daysOfWeek = moment.weekdays();
    this.firstWeekDay = this.daysOfWeek[this.startWeek];
  }

  checkWorkingDays(value: number) {
    return this.workingDays.includes(value);
  }

  changeWorkingDaysList(value: number) {
    if (this.workingDays.includes(value)) {
      this.workingDays = this.workingDays.filter(el => el !== value);
    } else {
      this.workingDays.push(value);
      this.workingDays.sort();
    }
    this.editModeOn();
  }

  getStartHours(): Array<string> {
    let time = moment('00:00', 'HH:mm').toDate();
    const end = moment(this.endHour, 'HH:mm').toDate();
    const hours = [];
    do {
      hours.push(moment(time).format('HH:mm'));
      time = moment(time).add(30, 'minutes').toDate();
    } while (!moment(time).isSame(end, 'minute') && moment(time).isBefore(end));
    return hours;
  }

  getEndHours(): Array<string> {
    let time = moment(this.startHour, 'HH:mm').toDate();
    const end = moment('23:30', 'HH:mm').toDate();
    const hours = [];
    do {
      time = moment(time).add(30, 'minutes').toDate();
      hours.push(moment(time).format('HH:mm'));
    } while (!moment(time).isSame(end, 'minute') && moment(time).isBefore(end));
    return hours;
  }

  editModeOn() {
    if (!this.workingDays.length) {
      this.editMode = false;
    } else { this.editMode = true; }
  }

  changeStartHour(hour: string) {
    this.editModeOn();
    this.startHour = hour;
    this.varEndHours = this.getEndHours();
  }

  changeEndHour(hour: string) {
    this.editModeOn();
    this.endHour = hour;
    this.varStartHours = this.getStartHours();
  }

  saveSettings() {
    const newSettings = {
      startWeek: this.startWeek,
      workingDays: this.workingDays,
      startHour: this.startHour,
      endHour: this.endHour
    };

    this.store.dispatch(new UpdateSettings(newSettings));
    this.editMode = false;
  }

}
