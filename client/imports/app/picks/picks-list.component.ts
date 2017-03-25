import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { Meteor } from 'meteor/meteor';
import { MeteorObservable } from 'meteor-rxjs';
import { InjectUser } from "angular2-meteor-accounts-ui";
import { MdDialog, MdDialogRef } from "@angular/material";

import 'rxjs/add/operator/combineLatest';

import { Picks } from '../../../../both/collections/picks.collection';
import { Pick } from '../../../../both/models/pick.model';
import { Users } from '../../../../both/collections/users.collection';
import { User } from '../../../../both/models/user.model';
import { MessageBox } from '../shared/messagebox';

import template from './picks-list.component.html';
import style from './picks-list.component.scss';

@Component({
  selector: 'picks-list',
  template,
  styles: [ style ]
})
@InjectUser('user')
export class PicksListComponent implements OnInit, OnDestroy {
  picks: Observable<Pick[]>;
  picksSub: Subscription;
  nameOrder: Subject<number> = new Subject<number>();
  optionsSub: Subscription;
  users: Observable<User>;
  user: Meteor.User;
  ownerSub: Subscription;
  
  constructor(
    private route: ActivatedRoute,
    public dialog: MdDialog
  ) {}

  ngOnInit() {
    this.optionsSub = Observable.combineLatest(
      this.nameOrder
    ).subscribe(([nameOrder]) => {
      const options: Options = {
        sort: { name: nameOrder as number }
      };

      if (this.picksSub) {
        this.picksSub.unsubscribe();
      }
      
      this.picksSub = MeteorObservable.subscribe('picks', options).subscribe(() => {
        this.picks = Picks.find({}, {
          sort: {
            name: nameOrder
          }
        }).zone();

      });
    });

    if (this.ownerSub) {
      this.ownerSub.unsubscribe();
    }
    
    this.ownerSub = MeteorObservable.subscribe('users', {}).subscribe(() => {
      this.users = Users.find({}).zone();
    });

    this.nameOrder.next(1);
  }

  removePick(pick: Pick): void {
        Picks.remove(pick._id);
/*
    let dialogRef = this.dialog.open(MessageBox);
    dialogRef.afterClosed().subscribe(result => {
      if (result == "Yes") {
        Picks.remove(pick._id);
      }
    });   
*/ 
  }

  changeSortOrder(nameOrder: string): void {
    this.nameOrder.next(parseInt(nameOrder));
  }

  isOwner(pick: Pick): boolean {
    return this.user && this.user._id === pick.owner;
  }

  ngOnDestroy() {
    this.picksSub.unsubscribe();
    this.optionsSub.unsubscribe();
  }
}
