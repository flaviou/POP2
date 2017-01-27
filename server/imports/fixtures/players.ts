import { Players } from '../../../both/collections/players.collection';
import { Player } from '../../../both/models/player.model';

export function loadPlayers() {
  if (Players.find().cursor.count() === 0) {
    const httpTransport = require('https');
    const responseEncoding = 'utf8';
    const httpOptions = {
        hostname: 'www.mysportsfeeds.com',
        port: '443',
        path: '/api/feed/pull/nhl/2016-2017-regular/roster_players.json?fordate=20170114',
        method: 'GET',
        headers: {"Authorization":"Basic ZmxhdmlvdTpob2NrZXk="}
    };
    httpOptions.headers['User-Agent'] = 'node ' + process.version;
 
    const request = httpTransport.request(httpOptions, (res) => {
        let responseBufs = [];
        let responseStr = '';
        
        res.on('data', (chunk) => {
            if (Buffer.isBuffer(chunk)) {
                responseBufs.push(chunk);
            }
            else {
                responseStr = responseStr + chunk;            
            }
        }).on('end', () => {
            responseStr = responseBufs.length > 0 ? 
                Buffer.concat(responseBufs).toString(responseEncoding) : responseStr;
            
            savePlayers(null, res.statusCode, res.headers, responseStr);
        });
        
    })
    .setTimeout(0)
    .on('error', (error) => {
        savePlayers(error, null, null, null);
    });
    request.write("")
    request.end();
  }
}

function savePlayers(error, statusCode, headers, body) {
    console.log('ERROR:', error); 
    console.log('STATUS:', statusCode);
    console.log('HEADERS:', JSON.stringify(headers));
    console.log('BODY:', body);
}
