import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';

import { ITask } from '../../models/task';
import { TaskModalComponent } from '../task-modal/task-modal.component';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';

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

  deleteTask(): void {
    this.dialogRef.close(TaskInfoModalComponent);
    this.dialog.open(ConfirmModalComponent, {
      width: '390px',
      data: [this.allTasks, this.task.id]
    });
  }

  editTask(): void {
    this.dialogRef.close(TaskInfoModalComponent);
    this.dialog.open(TaskModalComponent, {
      width: '540px',
      data: [this.allTasks, this.task.id]
    });
  }

  onCancelClick(): void {
    this.dialogRef.close(TaskInfoModalComponent);
  }

}
