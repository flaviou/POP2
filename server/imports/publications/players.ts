import { Meteor } from 'meteor/meteor';
import { Counts } from 'meteor/tmeasday:publish-counts';

import { Players } from '../../../both/collections/players.collection';

interface Options {
  [key: string]: any;
}

Meteor.publish('players', function(options: Options, teams?: string){
  const selector = buildQuery.call(this, null, teams);

  Counts.publish(this, 'numberOfPlayers', Players.collection.find(selector), { noReady: true });
  return Players.find(selector, options);
});

Meteor.publish('player', function(playerId: string) {
  return Players.find(buildQuery.call(this, playerId));
});


function buildQuery(playerId?: string, teams?: string): Object {
  const isAvailable = {
    $and: [{
      "RegularSeason.Points": {$gt: 0}
    },
    {  "TeamName": {$in: ["Capitals", "Penguins", "Blue Jackets", "Canadiens",
       "Maple Leafs", "Senators", "Blackhawks", "Wild", 
       "Blues", "Ducks", "Oilers", "Sharks", 
       "Rangers", "Bruins", "Flames", "Predators"]}
    },
    { $or: [{"TeamName": teams}]
    }
    ]
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
