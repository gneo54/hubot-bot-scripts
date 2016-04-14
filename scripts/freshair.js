var appConfig = require('../config');
var request = require('request');


module.exports = function(robot) {

    robot.hear(/(fresh air|freshair|fresh-air)/i, function(msg){
                         
        var url = 'https://api.forecast.io/forecast/' + appConfig.weatherIOapiKey + '/40.737422,-73.9923137';
        getWeather(url, function(weatherMsg) {
            if(typeof weatherMsg === 'undefined') {
              msg.reply('Sorry, could not retrieve the weather right now. Try again at a later time...');
            } else {
              var replyText = weatherMsg;

              msg.reply(replyText);
            }

          });
            
        

    });

    function responseWithHelp(msg){
        var postmsg = 'I can get the current weather outside NYC:\n\n*Usage*\n\n';
        var postmsg = postmsg + 'Use any the following commands: fresh air';
        
        msg.reply(postmsg);      
    }

   function getWeather (urlToCall, callback){


        request.get(
            urlToCall,
            {},
            function (error, response, body) {
                if (!error && response.statusCode == 200) {    

                var resJson = JSON.parse(body);        
                var returnText = 'The temperature right now is ' + Math.round(resJson.currently.temperature) + '°';
                returnText += ' - ' + resJson.minutely.summary;
                var prob = 0;
                
                prob += resJson.minutely.data[0].precipProbability
                prob += resJson.minutely.data[1].precipProbability
                prob += resJson.minutely.data[2].precipProbability
                prob += resJson.minutely.data[3].precipProbability
                prob += resJson.minutely.data[4].precipProbability;
                
                var probNext5 = (prob/5);
                returnText += '\n\n' + 'Chance of Rain in the next 5 minutes: ' + Math.round(100*probNext5) + '%';
                return callback(returnText);
                    
                }else{
                    return callback(undefined);
                }
            }
        );

    }

}