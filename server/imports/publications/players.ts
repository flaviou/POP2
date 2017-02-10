import { Meteor } from 'meteor/meteor';
import { Counts } from 'meteor/tmeasday:publish-counts';

import { Players } from '../../../both/collections/players.collection';

interface Options {
  [key: string]: any;
}

Meteor.publish('players', function(options: Options) {
  const selector = buildQuery.call(this, null);

  Counts.publish(this, 'numberOfPlayers', Players.collection.find(selector), { noReady: true });

<<<<<<< HEAD
  return Players.find(selector, options);
=======
  return Players.find(selector);
>>>>>>> e0578be2d7dc50a9c093b04bf444664a7f105b39
});

Meteor.publish('player', function(playerId: string) {
  return Players.find(buildQuery.call(this, playerId));
});


function buildQuery(playerId?: string): Object {
  const isAvailable = {
    $or: [{
      "RegularSeason.Points": {$gt:"0"}
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
