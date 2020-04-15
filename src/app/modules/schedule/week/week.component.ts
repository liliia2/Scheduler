import { Component, OnInit, OnChanges, Input, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { IAppState } from 'src/app/store/state/app.state';
import { TaskModalComponent } from '../../../modals/task-modal/task-modal.component';
import { TaskInfoModalComponent } from '../../../modals/task-info/task-info-modal.component';
import { selectTasksList } from 'src/app/store/selectors/tasks.selector';
import { ITask } from 'src/app/models/task';
import { LoadTasks, UpdateTasks } from 'src/app/store/actions/tasks.actions';

import * as moment from 'moment';

@Component({
  selector: 'app-week',
  templateUrl: './week.component.html',
  styleUrls: ['./week.component.css']
})
export class WeekComponent implements OnInit, OnChanges, OnDestroy {
  private subscription = new Subscription();
  @Input() selectedDay: Date;
  @Input() firstDayOfWeek: number;
  @Input() workingDays: Array<number>;
  @Input() startHour: string;
  @Input() endHour: string;
  @Input() timeInterval: number;
  @Input() displayOnlyWorkingDays: boolean;
  @Input() checkedTypes: Array<string>;
  @Input() checkedUsers: Array<number>;
  startWeek: Date;
  endWeek: Date;
  workingHours: Array<string>;
  displayedDays: Array<Date>;
  numberOfSelectedDay: number;
  allCeil: Array<any>;
  allTasks: ITask[];
  filtredTasks: ITask[];
  showTaskInfoMode = false;
  dragDropMode = false;
  dragTask: {
    'task': ITask,
    'left': string;
    'top': string;
  };

  constructor(
    private store: Store<IAppState>,
    public dialog: MatDialog
  ) {
    this.getRange();
    this.stopDragTask();
    const tasksSub = this.store.select(selectTasksList).subscribe(result => {
      if (result && !this.allTasks) {
        this.allTasks = result; // добавить фильтр тасок по времени внутри запроса, простая сортировка по времени
        this.allTasks = this.sortReceivedTask();
        if (this.checkedTypes && this.checkedUsers) {
          this.createSchedule();
        }
      }
    });
    this.subscription.add(tasksSub);
  }

  ngOnInit() {
    if (!this.allTasks) { this.store.dispatch(new LoadTasks()); }
  }

  ngOnChanges() {
    this.getRange();
    if (this.allTasks) {
      this.createSchedule();
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  sortReceivedTask(): ITask[] {
    return this.allTasks.sort((a: any, b: any) => {
      if (a.start > b.start) {
        return 1;
      }
      if (a.start < b.start) {
        return -1;
      }
      if (a.end > b.end) {
        return 1;
      }
      if (a.end < b.end) {
        return -1;
      }
      return 0;
    });
  }

  createSchedule(): void {
    this.filtredTasks = this.tasksFilterByUser();
    this.allCeil = this.getAllCeil();
    this.numberOfSelectedDay = this.getNumberOfSelectedDay();
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
    this.store.dispatch(new LoadTasks());
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

  getAllCeil(): any {
    const ceils = [];
    for (const day of this.displayedDays) {
      const dateInUnix = moment(day).format('X');
      let tasksArr = this.getTaskByDate(dateInUnix);
      if (tasksArr.length) { tasksArr = this.getTaskPosition(tasksArr); console.log('tasksArr', tasksArr); }
      ceils.push({
        date: day,
        tasks: tasksArr
      });
    }
    return ceils;
  }

  getTaskPosition(tasks: any) {
    const tasksWithPosition = [];
    for (const item of tasks) {
      const subcolumn = this.getSubcolumnCount(item, tasks);
      const task = {
        info: item,
        rowStart: this.getRowStart(item),
        rowEnd: this.getRowEnd(item),
        subcolumn: subcolumn[1],
        subcolumnStart: subcolumn[0],
        subcolumnEnd: subcolumn[0] + 1
      };
      tasksWithPosition.push(task);
    }
    return tasksWithPosition;
  }

  getRowStart(task: ITask): number {
    const startSheduleHour = moment(task.start, 'X').startOf('day')
      .add(moment(this.startHour, 'HH:mm').format('HH'), 'hours')
      .add(moment(this.startHour, 'HH:mm').format('mm'), 'minutes');
    return (moment(task.start, 'X').diff(startSheduleHour, 'minutes') / this.timeInterval) + 1;
  }

  getRowEnd(task: ITask): number {
    const endSheduleHour = moment(task.end, 'X').startOf('day')
      .add(moment(this.startHour, 'HH:mm').format('HH'), 'hours')
      .add(moment(this.startHour, 'HH:mm').format('mm'), 'minutes');
    return (moment(task.end, 'X').diff(endSheduleHour, 'minutes') / this.timeInterval) + 1;
  }

  getSubcolumnCount(item: ITask, tasks: ITask[]): number[] {
    if (tasks.length === 1) { return [0, 1]; }
    const crossedTasks = tasks.filter(el =>
      el.start === item.start ||
      el.end === item.end ||
      el.start < item.start && el.start > item.end ||
      item.start < el.start && item.start > el.end
    );
    const subcolumnStart = crossedTasks.indexOf(item);
    const subcolumnCount = crossedTasks.length;
    return [subcolumnStart, subcolumnCount];
  }

  getWorkingDays(days: Array<Date>): Array<Date> {
    return days.filter(el => this.workingDays.includes(moment(el).weekday()));
  }

  getNumberOfSelectedDay(): number {
    for (let i = 0; i < this.displayedDays.length; i++) {
      if (moment(this.selectedDay).isSame(this.displayedDays[i], 'day')) {
        return i;
      }
    }
  }

  getTaskByDate(date: string): ITask[] {
    return this.filtredTasks.filter((task) => moment(task.start, 'X').startOf('day').format('X') === date);
  }

  tasksFilterByUser() {
    const filtredByUser = this.allTasks.filter((task) => this.checkedUsers.includes(task.responsibleUser.id));
    return this.tasksFilterByType(filtredByUser);
  }

  tasksFilterByType(tasks: ITask[]): ITask[] {
    return tasks.filter((task) => this.checkedTypes.includes(task.type));
  }

  stopDragTask() {
    this.dragDropMode = false;
    this.dragTask = {
      task: null,
      left: '',
      top: ''
    };
  }

  addNewTask(day?: Date, hour?: string) {
    const start = hour;
    const end = moment(start, 'HH:mm').add(this.timeInterval, 'minutes').format('HH:mm');
    if (!this.showTaskInfoMode) {
      const dialogRef = this.dialog.open(TaskModalComponent, {
        width: '540px',
        data: {
          start,
          end,
          day
        },
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed', result);
      });
    }
  }

  showTaskInfo(task: ITask) {
    if (!this.dragDropMode) {
      this.showTaskInfoMode = true;
      const dialogRef = this.dialog.open(TaskInfoModalComponent, {
        width: '540px',
        data: task
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed', result);
        this.showTaskInfoMode = false;
      });
    }
  }

}
