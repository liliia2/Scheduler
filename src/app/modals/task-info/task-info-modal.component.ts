import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';

import { ITask } from '../../models/task';
import { TaskModalComponent } from '../task-modal/task-modal.component';

@Component({
  selector: 'app-task-info-modal',
  templateUrl: 'task-info-modal.component.html',
  styleUrls: ['./task-info-modal.component.css']
})
export class TaskInfoModalComponent implements OnInit {
  day: string;
  task: ITask;
  date: string;

  constructor(
    public dialogRef: MatDialogRef<TaskInfoModalComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: ITask
  ) { }

  ngOnInit() {
    this.task = this.data;
    this.date = this.getSateString();
  }

  getSateString(): string {
    const startTask = moment(this.task.start, 'X').format('HH:mm');
    const endTask = moment(this.task.end, 'X').format('HH:mm');
    return moment(this.task.start, 'X').format('DD MMMM YYYY') + ', ' + startTask + ' - ' + endTask;
  }

  editTask(task: ITask) {
    const dialogRef = this.dialog.open(TaskModalComponent, {
      width: '540px',
      data: task
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

}
