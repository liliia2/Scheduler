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
        this.allTasks = this.filterByWorkingTime(result);
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

  filterByWorkingTime(tasks: ITask[]) {
    return tasks.filter((task) =>
      task.end > +moment(this.getStartSheduleHour(task.start)).format('X') &&
      task.start < +moment(this.getEndSheduleHour(task.end)).format('X')
    );
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
    this.allCell = this.getAllCell();
    this.numberOfSelectedDay = this.getNumberOfSelectedDay();
  }

  tasksFilterByUser(): any {
    const filtredByUser = this.allTasks.filter((task) => this.checkedUsers.includes(task.responsibleUser.id));
    return this.tasksFilterByType(filtredByUser);
  }

  tasksFilterByType(tasks: ITask[]): ITask[] {
    return tasks.filter((task) => this.checkedTypes.includes(task.type));
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
    const arr = [time.format('HH:mm')];
    do {
      time = moment(time).add(this.timeInterval, 'minutes');
      if (!moment(time).isBefore(end)) { continue; }
      arr.push(time.format('HH:mm'));
    } while (!moment(time).isSame(end, 'minute') && moment(time).isBefore(end));
    return arr;
  }

  getDisplayedDays(): Array<Date> {
    let day = moment(this.startWeek).toDate();
    const arr = [day];
    do {
      day = moment(day).add(1, 'day').toDate();
      arr.push(day);
    } while (!moment(day).isSame(this.endWeek, 'day'));

    if (this.displayOnlyWorkingDays) {
      return this.getWorkingDays(arr);
    } else { return arr; }
  }

  getAllCell(): any {
    const emptyCells = this.getEmptyCells();
    const cellsWithTasks = this.getFilledCells();
    return emptyCells.concat(cellsWithTasks);
  }

  getEmptyCells(): any {
    const emptycells = [];
    for (let i = 0; i < this.displayedDays.length; i++) {
      const column = (i + 1) + ' / ' + (i + 2);
      for (let j = 0; j < this.workingHours.length; j++) {
        const row = (j + 1) + ' / ' + (j + 2);
        const time = moment(this.displayedDays[i])
          .add(moment(this.workingHours[j], 'HH:mm').format('HH'), 'hours')
          .add(moment(this.workingHours[j], 'HH:mm').format('mm'), 'minutes')
          .toDate();
        emptycells.push({
          column,
          content: false,
          row,
          subgrid: false,
          subcolumn: undefined,
          subrow: undefined,
          tasks: undefined,
          time
        });
      }
    }
    return emptycells;
  }

  getFilledCells(): any {
    let filledCells = [];
    for (const item of this.displayedDays) {
      const dateInUnix = moment(item).format('X');
      let tasksArr = this.getTaskByDate(dateInUnix);
      if (!tasksArr.length) { continue; }
      tasksArr = this.sortTasksByShedule(tasksArr);
      filledCells = filledCells.concat(tasksArr);
    }
    return filledCells;
  }

  sortTasksByShedule(tasks: any): any {
    const startWork: Date = this.getStartSheduleHour(tasks[0].start).toDate();
    const endWork: Date = this.getEndSheduleHour(tasks[0].end).toDate();
    tasks = tasks.filter(item =>
      moment(item.start, 'X').isBefore(endWork) ||
      moment(item.end, 'X').isAfter(startWork)
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

  sortUncrossedTasks(uncrossedTasks: any[]): any {
    for (const element of uncrossedTasks) {
      const col = this.getColumnPosition(element.info.day);
      element.column = col + '/' + (col + 1);
      const startWork = +(this.getStartSheduleHour(element.info.start).format('X'));
      const endWork = +(this.getEndSheduleHour(element.info.end).format('X'));
      let start = (element.info.start < startWork ? startWork : element.info.start);
      let end = (element.info.end > endWork ? endWork : element.info.end);
      element.row = this.getRowStart(start) + '/' + this.getRowEnd(end);
    }
    return uncrossedTasks;
  }

  sortCrossedTasks(crossedTasks: any[]): any {
    const updTasks = [];
    if (crossedTasks.length) {
      let group = [];
      let indexesOfGroup = [];
      let groupStartTime: number;
      let groupEndTime: number;
      const startWork = +(moment(this.getStartSheduleHour(crossedTasks[0].info.start)).format('X'));
      const endWork = +(moment(this.getEndSheduleHour(crossedTasks[0].info.end)).format('X'));
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
            const col = this.getColumnPosition(groupStartTime);
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
              column: col + '/' + (col + 1),
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
        let start = (item.groupStartTime < item.tasks[i].info.start) ? item.tasks[i].info.start : item.groupStartTime;
        let end = (item.groupEndTime > item.tasks[i].info.end) ? item.tasks[i].info.end : item.groupEndTime;
        item.tasks[i].column = columnStart + '/' + columnEnd;
        item.tasks[i].row =
          this.getRowStart(start, item.groupStartTime) + '/' +
          this.getRowEnd(end, item.groupStartTime);
      }
    }

    return updTasks;
  }

  getDifferentInMin(start: number, end: number): number {
    return moment(end, 'X').diff(moment(start, 'X'), 'minutes');
  }

  getColumnPosition(day: number) {
    for (let i = 0; i < this.displayedDays.length; i++) {
      if (moment(this.displayedDays[i]).isSame(moment(day, 'X').toDate(), 'day')) {
        return ++i;
      }
    }
  }

  getRowStart(start: number, groupStartTime?: number): number {
    const startBlock = groupStartTime ? groupStartTime : this.getStartSheduleHour(start);
    return Math.ceil((
      moment(start, 'X')
        .diff(moment(startBlock, 'X'), 'minutes') / this.timeInterval) + 1
    );
  }

  getRowEnd(end: number, groupEndTime?: number): number {
    const startBlock = groupEndTime ? groupEndTime : this.getStartSheduleHour(end);
    return Math.ceil((
      moment(end, 'X')
        .diff(moment(startBlock, 'X'), 'minutes') / this.timeInterval) + 1
    );
  }

  getStartSheduleHour(time: number): moment.Moment {
    return moment(time, 'X').startOf('day')
      .add(moment(this.startHour, 'HH:mm').format('HH'), 'hours')
      .add(moment(this.startHour, 'HH:mm').format('mm'), 'minutes');
  }

  getEndSheduleHour(time: number): moment.Moment {
    return moment(time, 'X').startOf('day')
      .add(moment(this.endHour, 'HH:mm').format('HH'), 'hours')
      .add(moment(this.endHour, 'HH:mm').format('mm'), 'minutes');
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

  addNewTask(day?: any): void {
    let start: string, end: string;
    if (day && typeof day === 'number') {
      day = moment(day, 'X').toDate();
      start = moment(day, 'X').format('HH:mm');
      end = moment(start, 'HH:mm').add(this.timeInterval, 'minutes').format('HH:mm');
    } else if (day) {
      day = moment(day).toDate();
      start = moment(day).format('HH:mm');
      end = moment(start, 'HH:mm').add(this.timeInterval, 'minutes').format('HH:mm');
    }
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
