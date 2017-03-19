import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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
  addForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.addForm = this.formBuilder.group({
      name: ['', Validators.required],
      public: [false]
    });
  }

  addPick(): void {
    if (!Meteor.userId()) {
      alert('Please log in to add a team');
      return;
    }

    if (this.addForm.valid) {
      Picks.insert({
        name: this.addForm.value.name,
        public: true,
        owner: Meteor.userId()
      });

      this.addForm.reset();
    }
  }
}
