import { Meteor } from 'meteor/meteor';

import { Picks } from '../../../both/collections/picks.collection';

interface Options {
  [key: string]: any;
}

Meteor.publish('picks', function(options: Options) {
  const selector = buildQuery.call(this, null);

  return Picks.find(selector, options);
});

Meteor.publish('pick', function(pickId: string) {
  return Picks.find({_id: pickId});
});


function buildQuery(pickId?: string): Object {

  if (pickId) {
    return { _id: pickId };
  }


  return {};
}
