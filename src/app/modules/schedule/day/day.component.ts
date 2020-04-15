import { Component, OnInit, OnChanges, Input } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-day',
  templateUrl: './day.component.html',
  styleUrls: ['./day.component.css']
})
export class DayComponent implements OnInit, OnChanges {
  @Input() selectedDay: Date;
  @Input() firstDayOfWeek: number;
  @Input() workingDays: Array<number>;
  @Input() startHour: string;
  @Input() endHour: string;
  @Input() timeInterval: number;
  @Input() checkedTypes: Array<string>;
  @Input() checkedUsers: Array<number>;
  workingHours: Array<string>;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
    if (this.startHour) {
      this.workingHours = this.getWorkingHours();
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

}
