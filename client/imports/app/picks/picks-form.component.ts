import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { MeteorObservable } from 'meteor-rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Counts } from 'meteor/tmeasday:publish-counts';
import { Picks } from '../../../../both/collections/picks.collection';
import { InjectUser } from "angular2-meteor-accounts-ui";
import template from './picks-form.component.html';
import style from './picks-form.component.scss';

@Component({
  selector: 'picks-form',
  template,
  styles: [ style ]
})
@InjectUser("user")
export class PicksFormComponent implements OnInit {
  numberOfPicks: number = 0;
//  autorunSub: Subscription;
  addForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.addForm = this.formBuilder.group({
      name: ['', Validators.required],
      public: [false]
    });
//    this.autorunSub = MeteorObservable.autorun().subscribe(() => {
    MeteorObservable.autorun().subscribe(() => {
      this.numberOfPicks = Counts.get('numberOfUserPicks');
    });
  }

  addPick(): void {
    if (!Meteor.userId()) {
      alert('Please log in to add a team');
      return;
    }


    if (this.addForm.valid) {
      var stats = {Goals: 0, Assists: 0, Points: 0};
      Picks.insert({
        name: this.addForm.value.name,
        public: true,
        owner: Meteor.userId(),
        RegularSeason: stats,
        Playoffs: stats
      });

      this.addForm.reset();
    }
  }
}
