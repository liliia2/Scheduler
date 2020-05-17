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
  selector: 'app-month',
  templateUrl: './month.component.html',
  styleUrls: ['./month.component.css']
})
export class MonthComponent implements OnInit, OnChanges, OnDestroy {
  private subscription = new Subscription();
  @Input() selectedDay: Date;
  @Input() firstDayOfWeek: number;
  @Input() workingDays: Array<number>;
  @Input() startHour: string;
  @Input() endHour: string;
  @Input() displayOnlyWorkingDays: boolean;
  @Input() checkedTypes: Array<string>;
  @Input() checkedUsers: Array<number>;
  startMonth: Date;
  endMonth: Date;
  workingHours: Array<string>;
  displayedDays: Array<Date>;
  numberOfSelectedDay: number;
  weekDaysArr: Array<string>;
  allCell: Array<any>;
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
      if (result && !this.allTasks || result && result !== this.allTasks) {
        this.allTasks = result;
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

  createSchedule(): void {
    this.filtredTasks = this.tasksFilterByUser();
    this.allCell = this.getAllCell();
    this.numberOfSelectedDay = this.getNumberOfSelectedDay();
    this.weekDaysArr = this.getWeekDaysArr();
  }

  getRange(): void  {
    this.startMonth = moment(this.selectedDay).startOf('month').toDate();
    this.endMonth = moment(this.selectedDay).endOf('month').toDate();
    if (this.startHour) {
      this.displayedDays = this.getDisplayedDays();
    }
  }

  getDisplayedDays(): Array<Date> {
    let day = moment(this.startMonth).toDate();
    const arr = [ day ];
    do {
      day = moment(day).add(1, 'day').toDate();
      arr.push(day);
    } while (!moment(day).isSame(this.endMonth, 'day'));

    if (this.displayOnlyWorkingDays) {
      return this.getWorkingDays(arr);
    } else { return arr; }
  }

  getAllCell(): any {
    const ceils = [];
    let j = this.firstDayOfWeek;
    while (j % 7 !== moment(this.displayedDays[0]).weekday() % 7) {
      if (!this.displayOnlyWorkingDays || this.workingDays.includes(j)) {
        ceils.push({ date: false, tasks: [] });
      }
      j++;
    }
    for (const item of this.displayedDays) {
      const dateInUnix = moment(item).format('X');
      const tasksArr = this.getTaskByDate(dateInUnix); // запрос только когда есть таски
      ceils.push({ date: item, tasks: tasksArr });
    }
    if (this.displayOnlyWorkingDays) {
      while (ceils.length % this.workingDays.length !== 0) {
        ceils.push({ date: false, tasks: []  });
      }
    } else {
      while (ceils.length % 7 !== 0) {
        ceils.push({ date: false, tasks: []  });
      }
    }
    return ceils;
  }

  getWorkingDays(days: Array<Date>): Array<Date> {
    return days.filter(el => this.workingDays.includes(moment(el).weekday()));
  }

  getNumberOfSelectedDay(): number {
    if (moment(this.displayedDays[0]).isSame(this.selectedDay, 'month')) {
      for (let i = 0; i < this.allCell.length; i++) {
        if (this.allCell[i].date && moment(this.selectedDay).isSame(this.allCell[i].date, 'day')) {
          return i;
        }
      }
    }
  }

  getWeekDaysArr(): Array<string> {
    const arr = [];
    for (let i = 0 + this.firstDayOfWeek; i < 7 + this.firstDayOfWeek; i++) {
      if (!this.displayOnlyWorkingDays || this.workingDays.includes(i % 7)) {
        arr.push(moment.weekdays(i % 7));
      }
    }
    return arr;
  }

  getTaskByDate(date: string): ITask[] {
    return this.filtredTasks.filter((task) => moment(task.day, 'X').startOf('day').format('X') === date);
  }

  tasksFilterByUser() {
    const filtredByUser = this.allTasks.filter((task) => this.checkedUsers.includes(task.responsibleUser.id));
    return this.tasksFilterByType(filtredByUser);
  }

  tasksFilterByType(tasks: ITask[]): ITask[] {
    return tasks.filter((task) => this.checkedTypes.includes(task.type));
  }

  tapTask(task: ITask): void {
    setTimeout(() => {
      this.checkTasksMode(task);
    }, 300);
  }

  checkTasksMode(task: ITask): void {
    if (this.showTaskInfoMode) {
      this.stopDragTask();
    } else {
      this.dragDropMode = true;
      this.dragTask.task = task;
    }
  }

  getTaskPosition(event: any): void {
    this.dragTask = {
      task: this.dragTask.task,
      left: event.pageX + 2 + 'px',
      top: event.pageY + 2 + 'px'
    };
  }

  stopDragTask(): void {
    this.dragDropMode = false;
    this.dragTask = {
      task: null,
      left: '',
      top: ''
    };
  }

  showTaskInfo(task: ITask): void {
    if (!this.dragDropMode) {
      this.showTaskInfoMode = true;
      const dialogRef = this.dialog.open(TaskInfoModalComponent, {
        width: '540px',
        data: [this.allTasks, task.id]
      });
      dialogRef.afterClosed().subscribe(result => {
        this.showTaskInfoMode = false;
      });
    }
  }

  addNewTask(day?: Date): void {
    if (!this.showTaskInfoMode) {
      this.dialog.open(TaskModalComponent, {
        width: '540px',
        data: [this.allTasks, day],
      });
    }
  }

  updateTask(day: Date): void {
    const task = this.dragTask.task;
    task.start = Number(moment(day)
      .add(moment(task.start, 'X').format('HH'), 'hours')
      .add(moment(task.start, 'X').format('mm'), 'minutes')
      .format('X'));
    task.end = Number(moment(day)
      .add(moment(task.end, 'X').format('HH'), 'hours')
      .add(moment(task.end, 'X').format('mm'), 'minutes')
      .format('X'));
    task.day = Number(moment(day)
      .startOf('day')
      .format('X'));
    this.allTasks.map((el) => {
      if (el.id === task.id) {
        el = task;
      }
    });
    this.stopDragTask();
    this.store.dispatch(new UpdateTasks(this.allTasks));
  }

}
