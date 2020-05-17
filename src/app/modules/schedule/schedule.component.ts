import { Component, OnInit, OnDestroy } from '@angular/core';
// import { Component, OnInit, OnDestroy, SimpleChanges, DoCheck, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { IAppState } from 'src/app/store/state/app.state';
import { selectUsersList } from 'src/app/store/selectors/users.selector';
import { selectSettings } from 'src/app/store/selectors/settings.selector';
import { ITask } from 'src/app/models/task';
import { IUser } from 'src/app/models/user';
import { ISettings } from 'src/app/models/settings';
import { LoadUsers } from 'src/app/store/actions/users.actions';
import { LoadSettings } from 'src/app/store/actions/settings.actions';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();
  ranges: Array<string> = ['Day', 'Week', 'Month'];
  showAllTasksTypes = true;
  types: Array<string> = ['All', 'Type1', 'Type2', 'Type3'];
  checkedTypes: Array<string> = ['All', 'Type1', 'Type2', 'Type3'];
  checkedUsers: Array<number> = [];
  displayOnlyWorkingDays = false;
  timeInterval = 60;
  today: Date;
  selectedRange: string;
  selectedDay: Date;
  users: Array<IUser>;
  tasks: ITask[];
  settings: ISettings;
  firstDayOfWeek: number;
  workingDays: Array<number>;
  startHour: string;
  endHour: string;

  constructor(
    private store: Store<IAppState>
  ) {
    this.today = moment().startOf('day').toDate();
    this.selectedDay = this.today;
    this.selectedRange = this.ranges[1];
    const usersSub = this.store.select(selectUsersList).subscribe(result => {
      if (result && !this.users) {
        this.users = result;
        this.users.forEach(user => this.checkedUsers.push(user.id));
      }
    });
    const settingsSub = this.store.select(selectSettings).subscribe(result => {
      if (result && !this.settings) {
        this.settings = result;
        this.setSettingsValue();
      }
    });
    this.subscription.add(usersSub);
    this.subscription.add(settingsSub);
  }

  ngOnInit() {
    if (!this.users) { this.store.dispatch(new LoadUsers()); }
    if (!this.settings) { this.store.dispatch(new LoadSettings()); }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  setSettingsValue() {
    this.firstDayOfWeek = this.settings.startWeek;
    this.workingDays = this.settings.workingDays;
    this.startHour = this.settings.startHour;
    this.endHour = this.settings.endHour;
  }

  checkShowedUserFilter(userId: number): boolean {
    return (this.checkedUsers.includes(userId) ? true : false);
  }

  changeShowedUsersList(userId: number): void {
    if (this.checkShowedUserFilter(userId)) {
      this.checkedUsers = this.checkedUsers.filter(item => item !== userId);
    } else { this.checkedUsers.push(userId); }
    this.checkedUsers = this.checkedUsers.slice();
  }

  checkShowedTypeFilter(type: string): boolean {
    return (this.checkedTypes.includes(type) ? true : false);
  }

  changeShowedTypeList(type: string): void {
    if (type === this.types[0]) {
      this.showAllTasksTypes = !this.showAllTasksTypes;
      this.checkedTypes = (this.showAllTasksTypes ? this.types : []);
    } else {
      if (this.checkShowedTypeFilter(type)) {
        this.checkedTypes = this.checkedTypes.filter(item => item !== type && item !== this.types[0]);
        this.showAllTasksTypes = false;
      } else {
        this.checkedTypes.push(type);
        if (this.checkedTypes.length === 3) {
          this.showAllTasksTypes = true;
          this.checkedTypes = this.types;
        }
      }
    }
    this.checkedTypes = this.checkedTypes.slice();
  }

  changeDisplayedDays() {
    this.displayOnlyWorkingDays = !this.displayOnlyWorkingDays;
  }

}
