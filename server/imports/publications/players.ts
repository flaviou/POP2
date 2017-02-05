import { Meteor } from 'meteor/meteor';
import { Counts } from 'meteor/tmeasday:publish-counts';

import { Players } from '../../../both/collections/players.collection';

interface Options {
  [key: string]: any;
}

Meteor.publish('players', function(options: Options) {
  const selector = buildQuery.call(this, null);

  Counts.publish(this, 'numberOfPlayers', Players.collection.find(), { noReady: true });

  return Players.find();
});

Meteor.publish('player', function(playerId: string) {
  return Players.find(buildQuery.call(this, playerId));
});


function buildQuery(playerId?: string): Object {
  const isAvailable = {
    $or: [{
      // party is public
      public: true
    }]
  };

  if (playerId) {
    return {
      // only single party
      $and: [{
          _id: playerId
        },
        isAvailable
      ]
    };
  }

  // const searchRegEx = { '$regex': '.*' + (location || '') + '.*', '$options': 'i' };

  return {
    $and: [
      isAvailable
    ]
  };
}