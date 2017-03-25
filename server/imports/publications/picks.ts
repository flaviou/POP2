import { Meteor } from 'meteor/meteor';

import { Picks } from '../../../both/collections/picks.collection';
import { Pick } from '../../../both/models/pick.model';
import { Players } from '../../../both/collections/players.collection';
import { Player } from '../../../both/models/player.model';

interface Options {
  [key: string]: any;
}

Meteor.publish('picks', function(options: Options) {
  const selector = buildQuery.call(this, null);

  return Picks.find(selector, options);
});

Meteor.publish('pick', function(pickId: string) {
  var pick = Picks.findOne({_id: pickId});
console.log(pick);
  return Picks.find({_id: pickId});
/*  pick: Pick;
  pick = Picks.findOne({_id: pickId});
console.log(pick);

  if (pick.players) {
    let x = 0;
    Players.find({ID: {$in: pick.players}}).forEach(function(player) {
console.log(player);
      x += parseInt(player.RegularSeason.Points);
consle.log(x);
    });
    pick.cost = x;
  }

  return pick;
*/
});

function buildQuery(pickId?: string): Object {

  if (pickId) {
    return { _id: pickId };
  }
  return {};
}
/*
Meteor.publish('pickCost', function(pickId: string) {
  var pick: Pick;
  var pickCost: Number = 0;

  pick = Picks.findOne({_id: pickId});
  if (pick) {
console.log(pick);
    Players.find({ID: {$in: pick.players}}).forEach( function (player) {
console.log(player);
      pickCost += player.RegularSeason.Points;
    }); 
  }
console.log('server teamCost');
console.log(pickCost);
  return pickCost;
});
*/
