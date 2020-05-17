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

  public confirmButtonTxt: string;
  public cancelButtonTxt: string;
  public title: string;
  public confirmTxt: string;

  constructor(
    public dialogRef: MatDialogRef<ConfirmModalComponent>,
    private store: Store<IAppState>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    if (this.data.length) {
      this.allTasks = this.data[0];
      this.task = this.data[0].filter(el => el.id === this.data[1])[0];
      this.confirmButtonTxt = 'Delete';
      this.cancelButtonTxt = 'Cancel';
      this.title = 'Deleting Task';
      this.confirmTxt = 'Are you sure you want to delete task ' + this.task.title + '?';
    } else {
      this.confirmButtonTxt = this.data.confirmButtonTxt;
      this.cancelButtonTxt = this.data.cancelButtonTxt;
      this.title = this.data.title;
      this.confirmTxt = this.data.confirmTxt;
    }
  }

  deleteTask() {
    const updTasksList = this.allTasks.filter((el) => el.id !== this.task.id);
    this.store.dispatch(new UpdateTasks(updTasksList));
    this.onCancelClick();
  }

  closeModale() {
    this.dialogRef.close(true);
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

}
