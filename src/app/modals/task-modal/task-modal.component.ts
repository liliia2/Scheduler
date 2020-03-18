import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as moment from 'moment';
import { FormGroup, FormControl } from '@angular/forms';

import { IUser } from '../../models/user';
import { ITask } from '../../models/task';
import { IAppState } from '../../store/state/app.state';
import { selectSettings } from '../../store/selectors/settings.selector';
import { selectUsersList } from '../../store/selectors/users.selector';

@Component({
  selector: 'task-modal',
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
  newTask: ITask;
  taskId: number;
  responsibleUser: IUser;
  
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
    @Inject(MAT_DIALOG_DATA) public data: ITask
  ) {
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
  
  ngOnInit() {
    if (this.data.id) {
      // console.log('this.data', this.data);
      this.task = this.data;
      this.setTaskData();
    } else if (this.data.taskStart) {
      this.taskForm.get('day').setValue(this.data.taskStart);
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  setTaskData() {
    this.taskForm.get('title').setValue(this.task.title);
    this.taskForm.get('description').setValue(this.task.description);
    this.taskForm.get('startTask').setValue(moment(this.task.taskStart, 'X').format('HH:mm'));
    this.taskForm.get('endTask').setValue(moment(this.task.taskEnd, 'X').format('HH:mm'));
    this.taskForm.get('day').setValue(moment(this.task.taskStart, 'X').toDate());
    this.taskForm.get('type').setValue(this.task.type);
    this.taskForm.get('responsibleUser').setValue(this.task.responsibleUser); 
    // this.responsibleUser = this.task.responsibleUser;
    // console.log('this.taskForm.get(responsibleUser)', this.taskForm.get('responsibleUser'));
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
    // console.log(this.taskForm.get('responsibleUser'));
    this.newTask = {
      id: 5,
      taskStart: Number(
        moment(this.taskForm.get('day').value)
        .add(this.taskForm.get('startTask').value.match(/^[0-9]+/)[0], 'hours')
        .add(this.taskForm.get('startTask').value.match(/[0-9]+$/)[0], 'minutes')
        .format('X')
      ),
      taskEnd: Number(
        moment(this.taskForm.get('day').value)
        .add(this.taskForm.get('endTask').value.match(/^[0-9]+/)[0], 'hours')
        .add(this.taskForm.get('endTask').value.match(/[0-9]+$/)[0], 'minutes')
        .format('X')
      ),
      type: this.taskForm.get('type').value,
      title: this.taskForm.get('title').value,
      description: this.taskForm.get('description').value,
      responsibleUser: this.taskForm.get('responsibleUser').value
    }
  }

  onCancelClick():void {
    this.dialogRef.close();
  }
  
}