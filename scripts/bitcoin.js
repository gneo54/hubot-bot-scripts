var request = require('request');


module.exports = function(robot) {

    robot.hear(/(bit coin|bitcoin)/i, function(msg){
        
            {
                var url = 'https://api.bitcoinaverage.com/ticker/USD/';
                getBitCoinTicker(url, function(tickerMsg) {
                    if(typeof tickerMsg === 'undefined') {
                      msg.reply('Sorry, could not retrieve the bitcoin price index right now. Try again at a later time...');
                    } else {
                      var replyText = tickerMsg;

                      msg.reply(replyText);
                    }

                  });
            }
        

    });

   function getBitCoinTicker (urlToCall, callback){


        request.get(
            urlToCall,
            {},
            function (error, response, body) {
                if (!error && response.statusCode == 200) {    

                var resJson = JSON.parse(body);        
                var returnText = '*bitcoin price index*\nAsk: ' + resJson.ask + '\nBid: ' +resJson.bid;
                
                return callback(returnText);
                    
                }else{
                    return callback(undefined);
                }
            }
        );

    }

}