import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-notice-modal',
  templateUrl: 'notice-modal.component.html',
  styleUrls: ['./notice-modal.component.css']
})
export class NoticeModalComponent implements OnInit {
  public confirmButtonTxt: string;
  public confirmTxt: string;

  constructor(
    public dialogRef: MatDialogRef<NoticeModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.confirmButtonTxt = this.data.confirmButtonTxt;
    this.confirmTxt = this.data.confirmTxt;
  }

  closeModale() {
    this.dialogRef.close();
  }
}
