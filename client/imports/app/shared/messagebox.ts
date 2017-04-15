import {Component} from '@angular/core';
import {MdDialog, MdDialogRef} from '@angular/material';

@Component({
  selector: 'message-box',
  templateUrl: './messagebox.html',
})

export class MessageBox {
  constructor(public dialogRef: MdDialogRef<MessageBox>) {}
}
