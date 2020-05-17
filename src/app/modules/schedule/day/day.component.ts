import { Component, OnInit, OnChanges, OnDestroy, Input } from '@angular/core';
import * as moment from 'moment';
import { MatDialog } from '@angular/material';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { ITask } from 'src/app/models/task';
import { TaskModalComponent } from 'src/app/modals/task-modal/task-modal.component';
import { TaskInfoModalComponent } from 'src/app/modals/task-info/task-info-modal.component';
import { IAppState } from 'src/app/store/state/app.state';
import { selectTasksList } from 'src/app/store/selectors/tasks.selector';
import { LoadTasks, UpdateTasks } from 'src/app/store/actions/tasks.actions';

@Component({
  selector: 'app-day',
  templateUrl: './day.component.html',
  styleUrls: ['./day.component.css']
})
export class DayComponent implements OnInit, OnChanges, OnDestroy {
  private subscription = new Subscription();
  @Input() selectedDay: Date;
  @Input() firstDayOfWeek: number;
  @Input() workingDays: Array<number>;
  @Input() startHour: string;
  @Input() endHour: string;
  @Input() timeInterval: number;
  @Input() checkedTypes: Array<string>;
  @Input() checkedUsers: Array<number>;
  workingHours: Array<string>;
  startWork: Date;
  endWork: Date;
  allTasks: ITask[];
  allCell: Array<any>;
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
    this.stopDragTask();
    const tasksSub = this.store.select(selectTasksList).subscribe(result => {
      if (result && !this.allTasks || result && result !== this.allTasks) {
        this.allTasks = result;
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
    this.setStarEndWork();
  }

  ngOnChanges() {
    this.setStarEndWork();
    if (this.startHour) { this.workingHours = this.getWorkingHours(); }
    if (this.allTasks) { this.createSchedule(); }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  setStarEndWork(): void {
    this.startWork = moment(this.selectedDay).startOf('day')
      .add(moment(this.startHour, 'HH:mm').format('HH'), 'hours')
      .add(moment(this.startHour, 'HH:mm').format('mm'), 'minutes')
      .toDate();
    this.endWork = moment(this.selectedDay).startOf('day')
      .add(moment(this.endHour, 'HH:mm').format('HH'), 'hours')
      .add(moment(this.endHour, 'HH:mm').format('mm'), 'minutes')
      .toDate();
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
    const dateInUnix = moment(this.selectedDay).format('X');
    this.filtredTasks = this.getTaskByDate(dateInUnix);
    this.allCell = this.getAllCell();
  }

  getTaskByDate(date: string): ITask[] {
    const filtredByDate = this.allTasks.filter(
      (task) => moment(task.start, 'X').startOf('day').format('X') === date
    );
    return this.tasksFilterByUser(filtredByDate);
  }

  tasksFilterByUser(tasks: ITask[]) {
    const filtredByUser = tasks.filter((task) => this.checkedUsers.includes(task.responsibleUser.id));
    return this.tasksFilterByType(filtredByUser);
  }

  tasksFilterByType(tasks: ITask[]): ITask[] {
    return tasks.filter((task) => this.checkedTypes.includes(task.type));
  }

  getAllCell(): any {
    const emptyCells = this.getEmptyCells();
    const cellsWithTasks = this.sortTasksByShedule(this.filtredTasks);
    return emptyCells.concat(cellsWithTasks);
  }

  getEmptyCells(): any {
    const emptycells = [];
    for (let i = 0; i < this.workingHours.length; i++) {
      const row = (i + 1) + ' / ' + (i + 2);
      const time = moment(this.selectedDay)
        .add(moment(this.workingHours[i], 'HH:mm').format('HH'), 'hours')
        .add(moment(this.workingHours[i], 'HH:mm').format('mm'), 'minutes')
        .toDate();
      emptycells.push({
        column: '1 / 2',
        content: false,
        row,
        subgrid: false,
        subcolumn: undefined,
        subrow: undefined,
        tasks: undefined,
        time
      });
    }
    return emptycells;
  }

  sortTasksByShedule(tasks: any): any {
    tasks = tasks.filter(item =>
      moment(item.start, 'X').isBefore(this.endWork) ||
      moment(item.end, 'X').isAfter(this.startWork)
    );
    tasks = this.setBaseTaskInfo(tasks);
    tasks = this.getCrossedTasks(tasks);
    let crossedTasks = tasks.filter(event => event.cross.length);
    let uncrossedTasks = tasks.filter(event => !event.cross.length);
    uncrossedTasks = uncrossedTasks.length ? this.sortUncrossedTasks(uncrossedTasks) : [];
    crossedTasks = crossedTasks.length ? this.sortCrossedTasks(crossedTasks) : [];
    const tasksWithPosition = uncrossedTasks.concat(crossedTasks);
    return tasksWithPosition;
  }

  setBaseTaskInfo(tasks: ITask[]): any {
    const updTasks = [];
    for (const element of tasks) {
      const newItem = {
        column: undefined,
        content: true,
        cross: [],
        info: element,
        row: undefined,
        subgrid: false,
        subcolumn: undefined,
        subrow: undefined
      };
      updTasks.push(newItem);
    }
    return updTasks;
  }

  getCrossedTasks(tasks: any[]): any {
    const updTasks = tasks;
    for (const itemI of updTasks) {
      for (const itemJ of updTasks) {
        if (itemI.info.id === itemJ.info.id) { continue; }
        if (
          moment(itemI.info.start).isBetween(itemJ.info.start, itemJ.info.end) ||
          moment(itemI.info.end).isBetween(itemJ.info.start, itemJ.info.end) ||
          moment(itemI.info.start, 'X').isSame(moment(itemJ.info.start, 'X'), 'minute')
        ) {
          itemI.cross.push(itemJ.info.id);
          itemJ.cross.push(itemI.info.id);
        }
      }
    }
    return updTasks;
  }

  sortCrossedTasks(crossedTasks: any[]): any {
    const updTasks = [];
    if (crossedTasks.length) {
      let group = [];
      let indexesOfGroup = [];
      let groupStartTime: number;
      let groupEndTime: number;
      const startWork = +(moment(this.startWork).format('X'));
      const endWork = +(moment(this.endWork).format('X'));
      for (const element of crossedTasks) {
        element.cross = [...new Set(element.cross)];
      }
      for (let i = 0; i <= crossedTasks.length; i++) {
        if (i !== 0 && i !== crossedTasks.length && indexesOfGroup.includes(crossedTasks[i].info.id)) {
          group.push(crossedTasks[i]);
          indexesOfGroup = indexesOfGroup.concat(crossedTasks[i].cross);
          if (groupEndTime < crossedTasks[i].info.end) {
            groupEndTime = (crossedTasks[i].info.end > endWork) ? endWork : crossedTasks[i].info.end;
          }
        } else {
          if (i !== 0 || i === crossedTasks.length) {
            let countCrossEl = 0;
            for (const index of indexesOfGroup) {
              const count = indexesOfGroup.filter(el => el === index).length;
              if (count > countCrossEl) { countCrossEl = count; }
            }
            let subgridColumnValue = Math.round(indexesOfGroup.length / countCrossEl);
            subgridColumnValue = (subgridColumnValue < countCrossEl) ? countCrossEl : subgridColumnValue;
            const subgridRowValue: number = Math.ceil(this.getDifferentInMin(groupStartTime, groupEndTime) / this.timeInterval);
            const eventGroup = {
              groupStartTime,
              groupEndTime,
              content: true,
              column: '1/2',
              row: this.getRowStart(groupStartTime) + '/' + this.getRowEnd(groupEndTime),
              tasks: group,
              subgrid: true,
              subgridColumn: subgridColumnValue,
              subgridRow: subgridRowValue
            };
            updTasks.push(eventGroup);
          }
          if (i !== crossedTasks.length) {
            groupStartTime = (crossedTasks[i].info.start < startWork) ? startWork : crossedTasks[i].info.start;
            groupEndTime = (crossedTasks[i].info.end > endWork) ? endWork : crossedTasks[i].info.end;
            group = [crossedTasks[i]];
            indexesOfGroup = crossedTasks[i].cross;
          }
        }
      }
    }

    for (const item of updTasks) {
      for (let i = 0; i < item.tasks.length; i++) {
        let columnStart = i + 1;
        if (columnStart > item.subgridColumn) {
          columnStart = columnStart % item.subgridColumn;
        }
        const columnEnd = columnStart + 1;
        let itemStart = item.groupStartTime;
        let itemEnd = item.groupEndTime;
        itemStart = (itemStart > item.tasks[i].info.start) ? item.tasks[i].info.start : itemStart;
        itemEnd = (itemEnd > item.tasks[i].info.end) ? item.tasks[i].info.end : itemEnd;
        item.tasks[i].column = columnStart + '/' + columnEnd;
        item.tasks[i].row =
          this.getRowStart(item.tasks[i].info.start, itemStart) + '/' +
          this.getRowEnd(itemEnd, itemStart);
        }
    }

    return updTasks;
  }

  sortUncrossedTasks(uncrossedTasks: any[]): any {
    for (const element of uncrossedTasks) {
      element.column = '1/2';
      element.row = this.getRowStart(element.info.start) + '/' + this.getRowEnd(element.info.end);
    }
    return uncrossedTasks;
  }

  getRowStart(start: number, itemStart?: number): number {
    const startBlock = itemStart ? itemStart : +moment(this.startWork).format('X');
    return Math.ceil((
      moment(start, 'X').diff(moment(startBlock, 'X'), 'minutes') / this.timeInterval) + 1
    );
  }

  getRowEnd(end: number, itemStart?: number): number {
    const startBlock = itemStart ? itemStart : +moment(this.startWork).format('X');
    return Math.ceil((
      moment(end, 'X').diff(moment(startBlock, 'X'), 'minutes') / this.timeInterval) + 1
    );
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

  updateTask(day: Date): void {
    const task = this.dragTask.task;
    const taskDuration = this.getDifferentInMin(this.dragTask.task.start, this.dragTask.task.end);
    task.start = Number(moment(day, 'X').format('X'));
    task.end = Number(moment(day, 'X').add(taskDuration, 'minutes').format('X'));
    task.day = Number(moment(day, 'X').startOf('day').format('X'));
    this.allTasks.map((el) => {
      if (el.id === task.id) { el = task; }
    });
    this.stopDragTask();
    this.store.dispatch(new UpdateTasks(this.allTasks));
  }

  getDifferentInMin(start: number, end: number): number {
    return moment(end, 'X').diff(moment(start, 'X'), 'minutes');
  }

  addNewTask(day?: any): void {
    if (this.showTaskInfoMode) { return; }
    if (typeof day === 'number') { day = moment(day, 'X').toDate(); }
    const start = moment(day).format('HH:mm');
    const end = moment(start, 'HH:mm').add(this.timeInterval, 'minutes').format('HH:mm');
    if (!this.showTaskInfoMode) {
      this.dialog.open(TaskModalComponent, {
        width: '540px',
        data: [this.allTasks, {
          start,
          end,
          day
        }],
      });
    }
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

}
