var request = require('request');


module.exports = function(robot) {

    robot.hear(/(money|payday)/i, function(msg){
        
            var daysLeft = 0;
            var today = new Date();

            var year = today.getYear();
            var month = today.getMonth();

            var isLeap = ((year % 4) == 0 && ((year % 100) != 0 || (year % 400) == 0));
            var daysInMonth = [31, (isLeap ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];

            var todayDay = today.getDate();

            if (todayDay < 15){
                daysLeft = 15 - todayDay;
            }
            else if (todayDay == 15){
                daysLeft = 0;

            }
            else if (todayDay >15){
                daysLeft = daysInMonth - todayDay;

            }
            else if (today >30 ){
                daysLeft = 0;

            }
            else if (today == daysInMonth ){
                daysLeft = 0;

            }
            
            var msgReply;

            if (daysLeft == 0){
                msgReply= '*Payday!*';
            }
            else{
                msgReply= daysLeft + ' day(s) till *Payday*';
            }
             msg.reply(msgReply);
            

    });

  

}