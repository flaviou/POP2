import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { MeteorObservable } from 'meteor-rxjs';
import { InjectUser } from "angular2-meteor-accounts-ui";

import 'rxjs/add/operator/combineLatest';

import { Picks } from '../../../../both/collections/picks.collection';
import { Pick } from '../../../../both/models/pick.model';
import template from './pick-detail.component.html';
import style from './pick-detail.component.scss';

@Component({
  selector: 'pick-detail',
  template,
  styles: [ style ]
})

@InjectUser('user')
export class PickDetailComponent implements OnInit, OnDestroy {
  pickId: string;
  pick: Pick;
  pickSub: Subscription;
  user: Meteor.User;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.paramsSub = this.route.params
      .map(params => params['pickId'])
      .subscribe(pickId => {
        this.pickId = pickId;
        
        if (this.pickSub) {
          this.pickSub.unsubscribe();
        }

        this.pickSub = MeteorObservable.subscribe('pick', this.pickId).subscribe(() => {
          MeteorObservable.autorun().subscribe(() => {
            this.pick = Picks.findOne(this.pickId);
            if (this.pick) {
              if (!this.pick.players) {
                var players = [];
                this.pick["players"] = players;
              }
              this.pick.players.sort(this.compare);
            }
          });
        });
      });
  }

  compare(a, b): number {
  var i = 0;
    if (a.TeamName < b.TeamName) {
      i = -1;
    } else if (a.TeamName > b.TeamName) {
      i = 1;
    } else if (a.LastName < b.LastName) {
      i = -1;
    } else if (a.LastName > b.LastName) {
      i = 1;
    } else if (a.FirstName < b.FirstName) {
      i = -1;
    } else if (a.FirstName > b.FirstName) {
      i = 1;
    }
    return i;
  }

  get isOwner(): boolean {
    return this.pick && this.user && this.user._id === this.pick.owner;
  }

  ngOnDestroy() {
    this.pickSub.unsubscribe();
  }
}
