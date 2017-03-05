import { Route } from '@angular/router';
import { Meteor } from 'meteor/meteor';

import { PlayersListComponent } from './players/players-list.component';
import { PicksListComponent } from './picks/picks-list.component';
import { PickEditComponent } from './picks/pick-edit.component';
import { PartiesListComponent } from './parties/parties-list.component';
import { PartyDetailsComponent } from './parties/party-details.component';
import { LoginComponent } from "./auth/login.component";
import { SignupComponent } from "./auth/signup.component";
import { RecoverComponent } from "./auth/recover.component";

export const routes: Route[] = [
  { path: 'player', component: PlayersListComponent },
  { path: '', component: PicksListComponent },
  { path: 'pick-edit/:pickId', component: PickEditComponent, canActivate: ['canActivateForLoggedIn'] },
  { path: 'party', component: PartiesListComponent },
  { path: 'party/:partyId', component: PartyDetailsComponent, canActivate: ['canActivateForLoggedIn'] },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'recover', component: RecoverComponent }
];

export const ROUTES_PROVIDERS = [{
  provide: 'canActivateForLoggedIn',
  useValue: () => !! Meteor.userId()
}];
