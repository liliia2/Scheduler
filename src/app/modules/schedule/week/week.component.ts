import { Component, OnInit, OnChanges, Input } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-week',
  templateUrl: './week.component.html',
  styleUrls: ['./week.component.css']
})
export class WeekComponent implements OnInit, OnChanges {
  @Input() selectedDay: Date;
  @Input() firstDayOfWeek: number;
  @Input() workingDays: Array<number>;
  @Input() startHour: string;
  @Input() endHour: string;
  @Input() timeInterval: number;
  @Input() displayOnlyWorkingDays: boolean;
  startWeek: Date;
  endWeek: Date;
  workingHours: Array<string>;
  displayedDays: Array<Date>;
  numberOfSelectedDay: number | false;

  constructor() {
    this.getRange();
  }

  ngOnInit() {}

  ngOnChanges() {
    this.getRange();
  }

  getRange(): void {
    this.startWeek = (moment(this.selectedDay).weekday() >= this.firstDayOfWeek ?
      moment(this.selectedDay).startOf('week').add(this.firstDayOfWeek, 'day').toDate() :
      moment(this.selectedDay).add(-7, 'day').startOf('week').add(this.firstDayOfWeek, 'day').toDate()
    );
    this.endWeek = (moment(this.selectedDay).weekday() >= this.firstDayOfWeek ?
      moment(this.selectedDay).endOf('week').add(this.firstDayOfWeek, 'day').toDate() :
      moment(this.selectedDay).add(-7, 'day').endOf('week').add(this.firstDayOfWeek, 'day').toDate()
    );
    if (this.startHour) {
      this.workingHours = this.getWorkingHours();
      this.displayedDays = this.getDisplayedDays();
      this.numberOfSelectedDay = this.getNumberOfSelectedDay();
    }
  }

  getWorkingHours(): Array<string> {
    let time = moment(this.startHour, 'HH:mm');
    const end = moment(this.endHour, 'HH:mm');
    const arr = [ time.format('HH:mm') ];
    do {
      time = moment(time).add(this.timeInterval, 'minutes');
      if (!moment(time).isBefore(end)) { continue; }
      arr.push(time.format('HH:mm'));
    } while (!moment(time).isSame(end, 'minute') && moment(time).isBefore(end));

    return arr;
  }

  getDisplayedDays(): Array<Date> {
    let day = moment(this.startWeek).toDate();
    const arr = [ day ];
    do {
      day = moment(day).add(1, 'day').toDate();
      arr.push(day);
    } while (!moment(day).isSame(this.endWeek, 'day'));

    if (this.displayOnlyWorkingDays) {
      return this.getWorkingDays(arr);
    } else { return arr; }
  }

  getWorkingDays(days: Array<Date>): Array<Date> {
    return days.filter(el => this.workingDays.includes(moment(el).weekday()));
  }

  getNumberOfSelectedDay(): number | false {
    for (let i = 0; i < this.displayedDays.length; i++) {
      if (moment(this.selectedDay).isSame(this.displayedDays[i], 'day')) {
        return i;
      }
    }
    return false;
  }

}
