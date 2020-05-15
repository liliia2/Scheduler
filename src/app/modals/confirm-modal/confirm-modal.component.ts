import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';

import { IAppState } from '../../store/state/app.state';
import { ITask } from '../../models/task';
import { UpdateTasks } from 'src/app/store/actions/tasks.actions';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: 'confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.css']
})
export class ConfirmModalComponent implements OnInit {
  task: ITask;
  allTasks: ITask[];

  constructor(
    public dialogRef: MatDialogRef<ConfirmModalComponent>,
    private store: Store<IAppState>,
    @Inject(MAT_DIALOG_DATA) public data: [ITask[], number]
  ) { }

  ngOnInit() {
    this.allTasks = this.data[0];
    this.task = this.data[0].filter(el => el.id === this.data[1])[0];
  }

  deleteTask() {
    const updTasksList = this.allTasks.filter((el) => el.id !== this.task.id);
    this.store.dispatch(new UpdateTasks(updTasksList));
    this.onCancelClick();
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

}
