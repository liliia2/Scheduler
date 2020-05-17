import { Component, Inject, OnInit, OnDestroy, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as moment from 'moment';
import { FormGroup, FormControl, FormGroupDirective, NgForm } from '@angular/forms';

import { IUser } from '../../models/user';
import { ITask } from '../../models/task';
import { IAppState } from '../../store/state/app.state';
import { selectSettings } from '../../store/selectors/settings.selector';
import { selectUsersList } from '../../store/selectors/users.selector';
import { UpdateTasks } from 'src/app/store/actions/tasks.actions';
import { ErrorStateMatcher } from '@angular/material';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-task-modal',
  templateUrl: 'task-modal.component.html',
  styleUrls: ['./task-modal.component.css']
})
export class TaskModalComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();
  types: Array<string> = ['Type1', 'Type2', 'Type3'];
  users: IUser[];
  selectedRange: string;
  startHour: string;
  endHour: string;
  startTask: string;
  endTask: string;
  varStartHours: Array<string>;
  varEndHours: Array<string>;
  task: ITask;
  allTasks: ITask[];
  taskId: number;
  responsibleUser: IUser;

  matcher = new MyErrorStateMatcher();
  taskForm = new FormGroup({
    title: new FormControl(''),
    description: new FormControl(''),
    startTask: new FormControl(Date),
    endTask: new FormControl(Date),
    day: new FormControl(Date),
    type: new FormControl(''),
    responsibleUser: new FormControl({
      id: '',
      fullName: ''
    })
  });
  constructor(
    public dialogRef: MatDialogRef<TaskModalComponent>,
    private store: Store<IAppState>,
    @Inject(MAT_DIALOG_DATA) public data: [ITask[], any]
  ) {
      this.addSubscr();
  }

  ngOnInit() {
    this.setStartData();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  addSubscr() {
    const settingsSub = this.store.select(selectSettings).subscribe(result => {
      if (result) {
        this.startHour = result.startHour;
        this.endHour = result.endHour;
        this.varStartHours = this.getStartHours(this.startHour, this.endHour);
        this.varEndHours = this.getEndHours(this.startHour, this.endHour);
      }
    });
    const usersSub = this.store.select(selectUsersList).subscribe(result => {
      if (result && !this.users) {
        this.users = result;
      }
    });
    this.subscription.add(settingsSub);
    this.subscription.add(usersSub);
  }

  setStartData() {
    if (!this.data[1]) {
      this.allTasks = this.data[0];
    } else if (typeof this.data[1] === 'number') {
      this.allTasks = this.data[0];
      this.task = this.data[0].filter(el => el.id === this.data[1])[0];
      this.setTaskData();
    } else if (!this.data[1].start && !this.data[1].end) {
      this.allTasks = this.data[0];
      this.taskForm.get('day').setValue(this.data[1]);
    } else {
      this.allTasks = this.data[0];
      this.taskForm.get('startTask').setValue(this.data[1].start);
      this.taskForm.get('endTask').setValue(this.data[1].end);
      this.taskForm.get('day').setValue(this.data[1].day);
    }
  }

  setTaskData() {
    this.taskForm.get('title').setValue(this.task.title);
    this.taskForm.get('description').setValue(this.task.description);
    this.taskForm.get('startTask').setValue(moment(this.task.start, 'X').format('HH:mm'));
    this.taskForm.get('endTask').setValue(moment(this.task.end, 'X').format('HH:mm'));
    this.taskForm.get('day').setValue(moment(this.task.start, 'X').toDate());
    this.taskForm.get('type').setValue(this.task.type);
    this.taskForm.get('responsibleUser').setValue(this.task.responsibleUser);
  }

  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  checkInputs(): boolean {
    return (
      this.taskForm.get('title').value &&
      this.taskForm.get('type').value &&
      this.taskForm.get('responsibleUser').value.id) ? true : false;
  }

  getStartHours(start: string, end: string): Array<string> {
    let time = moment(start, 'HH:mm').toDate();
    const endTime = moment(end, 'HH:mm').toDate();
    const hours = [];
    do {
      hours.push(moment(time).format('HH:mm'));
      time = moment(time).add(30, 'minutes').toDate();
    } while (!moment(time).isSame(endTime, 'minute') && moment(time).isBefore(endTime));
    return hours;
  }

  getEndHours(start: string, end: string): Array<string> {
    let time = moment(start, 'HH:mm').toDate();
    const endTime = moment(end, 'HH:mm').toDate();
    const hours = [];
    do {
      time = moment(time).add(30, 'minutes').toDate();
      hours.push(moment(time).format('HH:mm'));
    } while (!moment(time).isSame(endTime, 'minute') && moment(time).isBefore(endTime));
    return hours;
  }

  setStartHour(hour: string) {
    this.startTask = hour;
    this.varEndHours = this.getEndHours(hour, this.endHour);
  }

  setEndHour(hour: string) {
    this.endTask = hour;
    this.varStartHours = this.getStartHours(this.startHour, hour);
  }

  saveTask() {
    const task = this.getTaskData();
    const updTasksList = this.getUpdTasksList(task);
    this.store.dispatch(new UpdateTasks(updTasksList));
    this.onCancelClick();
  }

  getTaskData(): ITask {
    const taskId = this.getTaskId();
    const newTask = {
      id: taskId,
      start: Number(
        moment(this.taskForm.get('day').value)
        .startOf('day')
        .add(this.taskForm.get('startTask').value.match(/^[0-9]+/)[0], 'hours')
        .add(this.taskForm.get('startTask').value.match(/[0-9]+$/)[0], 'minutes')
        .format('X')
      ),
      end: Number(
        moment(this.taskForm.get('day').value)
        .startOf('day')
        .add(this.taskForm.get('endTask').value.match(/^[0-9]+/)[0], 'hours')
        .add(this.taskForm.get('endTask').value.match(/[0-9]+$/)[0], 'minutes')
        .format('X')
      ),
      day: Number(moment(this.taskForm.get('day').value).startOf('day').format('X')),
      type: this.taskForm.get('type').value,
      title: this.taskForm.get('title').value,
      description: this.taskForm.get('description').value,
      responsibleUser: this.taskForm.get('responsibleUser').value
    };
    return newTask;
  }

  getUpdTasksList(task: ITask): ITask[] {
    let tasksList = [];
    tasksList = this.allTasks
      .filter(el => el.id !== task.id)
      .concat(task);
    return tasksList;
  }

  getTaskId(): number {
    if (this.data[1] && typeof this.data[1] === 'number') {
      return this.data[1];
    }
    let id: number;
    this.allTasks.forEach(element => {
      if (!id) { id = element.id;
      } else if (id <= element.id) {
        id = element.id + 1;
      }
    });
    return id;
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

}
