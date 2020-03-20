import { Component, OnInit, OnChanges, Input, OnDestroy, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { IAppState } from 'src/app/store/state/app.state';
import { TaskModalComponent } from '../../../modals/task-modal/task-modal.component';
import { TaskInfoModalComponent } from '../../../modals/task-info/task-info-modal.component';
import { selectTasksList } from 'src/app/store/selectors/tasks.selector';
import { ITask } from 'src/app/models/task';
import { LoadTasks, UpdateTask } from 'src/app/store/actions/tasks.actions';

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
  @Input() timeInterval: number;
  @Input() displayOnlyWorkingDays: boolean;
  @Input() checkedTypes: Array<string>;
  @Input() checkedUsers: Array<number>;
  startMonth: Date;
  endMonth: Date;
  workingHours: Array<string>;
  displayedDays: Array<Date>;
  numberOfSelectedDay: number | false;
  weekDaysArr: Array<string>;
  allCeil: Array<any>;
  allTasks: ITask[];
  filtredTasks: ITask[];
  showTaskInfoMode: boolean = false;
  dragDropMode: boolean = false;
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
        this.allTasks = result; // фильтр тасок по времени внутри запроса, простая сортировка по времени
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

  createSchedule(){
    this.filtredTasks = this.tasksFilterByUser();
    this.allCeil = this.getAllCeil();
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

  getAllCeil(): any {
    let ceils = [];
    let j = this.firstDayOfWeek;
    while (j % 7 !== moment(this.displayedDays[0]).weekday() % 7) {
      if (!this.displayOnlyWorkingDays || this.workingDays.includes(j)) {
        ceils.push({ date: false, tasks: [] });
      }
      j++;
    }
    for (let item of this.displayedDays) {
      const dateInUnix = moment(item).format('X');
      let tasksArr = this.getTaskByDate(dateInUnix); // запрос только когда есть таски
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

  getNumberOfSelectedDay(): number | false {
    if (moment(this.displayedDays[0]).isSame(this.selectedDay, 'month')) {
      for (let i = 0; i < this.allCeil.length; i++) {
        if (this.allCeil[i].date && moment(this.selectedDay).isSame(this.allCeil[i].date, 'day')) {
          return i;
        }
      }
    }
    return false;
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
    return this.filtredTasks.filter((task) => moment(task.taskStart, 'X').startOf('day').format('X') === date);
  }

  tasksFilterByUser() {
    let filtredByUser = this.allTasks.filter((task) => this.checkedUsers.includes(task.responsibleUser.id));
    return this.tasksFilterByType(filtredByUser);
  }

  tasksFilterByType(tasks: ITask[]): ITask[] {
    return tasks.filter((task) => this.checkedTypes.includes(task.type));
  }

  tapTask(task: ITask) {
    setTimeout(() => {
      this.checkTasksMode(task);
    }, 300);
  }

  checkTasksMode(task: ITask) {
    if (this.showTaskInfoMode) {
      this.stopDragTask();
    } else {
      this.dragDropMode = true;
      this.dragTask.task = task;
    }
  }

  getTaskPosition(event: any) {
    this.dragTask = {
      'task': this.dragTask.task,
      'left': event.pageX + 2 + 'px',
      'top': event.pageY + 2 + 'px'
    };
  }

  stopDragTask() {
    this.dragDropMode = false;
    this.dragTask = {
      'task': null,
      'left': '',
      'top': ''
    };
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

  addNewTask(day?: Date) {
    if (!this.showTaskInfoMode) {
      const dialogRef = this.dialog.open(TaskModalComponent, {
        width: '540px',
        data: {
          taskStart: day
        },
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed', result);
      });
    }
  }

  updateTask(day: Date) {
    let task = this.dragTask.task;
    task.taskStart = Number(moment(day)
      .add(moment(task.taskStart, 'X').format('HH'), 'hours')
      .add(moment(task.taskStart, 'X').format('mm'), 'minutes')
      .format('X'));
    task.taskEnd = Number(moment(day)
      .add(moment(task.taskEnd, 'X').format('HH'), 'hours')
      .add(moment(task.taskEnd, 'X').format('mm'), 'minutes')
      .format('X'));
    this.store.dispatch(new UpdateTask(task));
  }

}
