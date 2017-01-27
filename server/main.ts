import { Meteor } from 'meteor/meteor';

import { loadParties } from './imports/fixtures/parties';
import { loadTeams } from './imports/fixtures/teams';
import { loadPlayers } from './imports/fixtures/players';

import './imports/publications/parties';
import './imports/publications/users';
import '../both/methods/parties.methods';
import './imports/publications/images';

Meteor.startup(() => {
  loadParties();
  loadTeams();
  loadPlayers();
});
