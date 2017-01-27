import { Teams } from '../../../both/collections/teams.collection';
import { Team } from '../../../both/models/team.model';

export function loadTeams() {
  if (Teams.find().cursor.count() === 0) {
    var url = "http://www.nicetimeonice.com/api/teams";
    HTTP.call("GET", url, function(error, result){
      if (error) {
        console.log(error);
      }
      if (result) {
        var teamArr = result.data;
        var len = teamArr.length;
        for (var i=0; i < len; i++) {
          teamArr[i]['season'] = '2016-2017';
          Teams.insert(teamArr[i]);
        }
      } 
    });
  }
}