import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import * as moment from 'moment';

import { IAppState } from '../../store/state/app.state';
import { ITask } from '../../models/task';
import { TaskModalComponent } from '../task-modal/task-modal.component';
import { UpdateTasks } from 'src/app/store/actions/tasks.actions';

@Component({
  selector: 'app-task-info-modal',
  templateUrl: 'task-info-modal.component.html',
  styleUrls: ['./task-info-modal.component.css']
})
export class TaskInfoModalComponent implements OnInit {
  day: string;
  task: ITask;
  allTasks: ITask[];
  date: string;

  constructor(
    public dialogRef: MatDialogRef<TaskInfoModalComponent>,
    public dialog: MatDialog,
    private store: Store<IAppState>,
    @Inject(MAT_DIALOG_DATA) public data: [ITask[], number]
  ) { }

  ngOnInit() {
    this.allTasks = this.data[0];
    this.task = this.data[0].filter(el => el.id === this.data[1])[0];
    this.date = this.getSateString();
  }

  getSateString(): string {
    const startTask = moment(this.task.start, 'X').format('HH:mm');
    const endTask = moment(this.task.end, 'X').format('HH:mm');
    return moment(this.task.start, 'X').format('DD MMMM YYYY') + ', ' + startTask + ' - ' + endTask;
  }

  deleteTask() {
    const updTasksList = this.allTasks.filter((el) => el.id !== this.task.id);
    this.store.dispatch(new UpdateTasks(updTasksList));
    this.onCancelClick();
  }

  editTask() {
    this.dialog.open(TaskModalComponent, {
      width: '540px',
      data: [this.allTasks, this.task.id]
    });
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

}
