import { Meteor } from 'meteor/meteor';
import { Counts } from 'meteor/tmeasday:publish-counts';

import { Picks } from '../../../both/collections/picks.collection';

interface Options {
  [key: string]: any;
}

Meteor.publish('picks', function(options: Options) {
  var selector = {owner: this.userId};
  Counts.publish(this, 'numberOfUserPicks', Picks.collection.find(selector), { noReady: true });
  return Picks.find({}, options);
});


Meteor.publish('userPicks', function() {
  var selector = {owner: Meteor.userId()};
console.log(Meteor.userId());
console.log(selector);  
  Counts.publish(this, 'numberOfUserPicks'. Picks.collection.find(selector), { noReady: true });
  return Picks.find(selector);
});

function buildQuery(pickId?: string): Object {

  if (pickId) {
    return { _id: pickId };
  }
  return {};
}

Meteor.publish('pick', function(pickId: string) {
  return Picks.find({_id: pickId});
});

