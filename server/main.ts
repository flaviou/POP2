import { Meteor } from 'meteor/meteor';

import { loadParties } from './imports/fixtures/parties';

import './imports/publications/players';
import './imports/publications/picks';
import './imports/publications/parties';
import './imports/publications/users';
import '../both/methods/parties.methods';
import './imports/publications/images';

Meteor.startup(() => {
  process.env.MAIL_URL = "smtp://postmaster%40mg.flaviouemura.com:e612ccc58102f84c8c39878a4ffce1e6@smtp.mailgun.org:587";
  Accounts.emailTemplates.siteName = "Hockey@FlavioUemura";
  Accounts.emailTemplates.from = "Hockey@FlavioUemura <no-reply@flaviouemura.com>";
});
