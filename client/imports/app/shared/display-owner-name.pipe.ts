import { Pipe, PipeTransform } from '@angular/core';
import { Meteor } from 'meteor/meteor';
import { User } from '../../../../both/models/user.model';
import { Users } from '../../../../both/collections/users.collection';

@Pipe({
  name: 'displayOwnerName'
})
export class DisplayOwnerNamePipe implements PipeTransform {
  transform(ownerId: string): string {
    if (!ownerId) {
      return '';
    }

    var user: User;

    user = Users.findOne({_id: ownerId});

    if (!user) {
      return '';
    }

    if (user.username) {
      return user.username;
    }

    if (user.emails) {
      return user.emails[0].address;
    }

    return '';
  }
}
