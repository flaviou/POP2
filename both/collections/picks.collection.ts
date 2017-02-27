import { MongoObservable } from 'meteor-rxjs';
import { Meteor } from 'meteor/meteor';

import { Pick } from '../models/pick.model';

export const Picks = new MongoObservable.Collection<Pick>('picks');

function loggedIn() {
  return !!Meteor.user();
}

Picks.allow({
  insert: loggedIn,
  update: loggedIn,
  remove: loggedIn
});
