import { MongoObservable } from 'meteor-rxjs';
import { Meteor } from 'meteor/meteor';

import { Team } from '../models/team.model';

export const Teams = new MongoObservable.Collection<Team>('teams');


