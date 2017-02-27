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
  return Picks.find(buildQuery.call(this, pickId));
});


function buildQuery(pickId?: string): Object {
  const isAvailable = {};

  if (pickId) {
    return {
      // only single pick
      $and: [{
          _id: pickId
        },
        isAvailable
      ]
    };
  }


  return {};
}
