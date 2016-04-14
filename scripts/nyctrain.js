var request = require('request');
var cheerio = require('cheerio');

module.exports = function(robot) {

    robot.respond(/train (.*)/i, function(msg){
        
        var trainline = msg.match[1];
        if (trainline.toLowerCase() == 'help' || trainline.toLowerCase() == '--help' ||trainline.toLowerCase() == '/help'||trainline.toLowerCase() == '-help'){
            responseWithHelp(msg);         
        }
        else{
            getServiceStatus(trainline, function getTrainStatusExCallback(response, translatedtrainline){
                getTrainStatusEx(onActionCallback, response, translatedtrainline, msg);
            });
        }
    });


    function responseWithHelp(msg){
        var postmsg = 'I can get Service Status for the following trains:\n\n*MTA*\n\n';
        var postmsg = postmsg + 'Use any of the following parameters: 1,2,3,4,5,6,7,A,C,E,B,D,F,M,N,Q,R,L,G,J,Z';
        var postmsg = postmsg + '\n\n*Path*\n\n';
        var postmsg = postmsg + 'Use the following parameter: path';
        var postmsg = postmsg + '\n\n*NJ Transit*\n\n';
        var postmsg = postmsg + 'Use any of the following parameters: Northeast Corridor, North Jersey Coast, Raritan Valley, Morris & Essex, Main/Bergen/Port Jervis, Montclair-Boonton, Pascack Valley, Atlantic City, Hudson-Bergen Light Rail, Newark Light Rail, River Line';
            

        msg.reply(postmsg);      
    }

    function getTrainStatusEx(callback, actualstatus, translatedTrainLine, msg) {

            var speechOutput = "";


            if(translatedTrainLine != null && translatedTrainLine != '' && translatedTrainLine != undefined && translatedTrainLine != 'undefined') {
                //translate trainline
                speechOutput = "The status of the " + translatedTrainLine + " train is " + actualstatus;//Good Service"  + getServiceStatus();
                
            }
            else {
                speechOutput = "I'm not sure what train that is. Try typing, 'train 1' or 'train L'.  I can look up all MTA trains, NJ Trains and the path train.";
                
            }
    
           callback(speechOutput, msg);
        }

    function onActionCallback(trainresponse, msg) {
        msg.reply(trainresponse);      
     }

     function doCallForNJTransit(trainline, urlToCall, callbackfunc){
        //$("span:contains('Northeast Corridor')").parent().next().next().text();

           request.post(
            urlToCall,
            {},
            function (error, response, body) {
                if (!error && response.statusCode == 200) {            
                    console.log('PATH DEBUG:', trainline);  
                    console.log('PATH DEBUG: 200');  
                $ = cheerio.load(body);
                
                var newserviceStatus = $("span:contains('" + trainline + "')").parent().next().next().text().replace(/[\n\t\r]/g,"").trim();
                    console.log('PATH DEBUG: STATUS: ' + newserviceStatus);
                    if (newserviceStatus.toLowerCase() == 'view alert'){

                        newserviceStatus = 'ALERT!';
                    }  

                    return callbackfunc(newserviceStatus + ' - More info @ http://www.njtransit.com/sa/sa_servlet.srv?hdnPageAction=TravelAlertsTo');
                }
            }
        );

     }
    function docallforMTA(trainline, urlToCall, callbackfunc){
        
        request.post(
            urlToCall,
            { form: { 'lineName': trainline, 'mode': 'Subways'  } },
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    //console.log(body)

                $ = cheerio.load(body);
                var newserviceStatus = $('#status-contents').text().replace(/[\n\t\r]/g,"").trim();
                
                    return callbackfunc(newserviceStatus);
                }
            }
        );
    }

function docallforPath(trainline, urlToCall, callbackfunc){
        

        //var postData = 'ctl00_RadScriptManager1_TSM=%3B%3BSystem.Web.Extensions%2C+Version%3D4.0.0.0%2C+Culture%3Dneutral%2C+PublicKeyToken%3D31bf3856ad364e35%3Aen-US%3Af01b1325-3d40-437a-8da2-df3d86714220%3Aea597d4b%3Ab25378d2&__EVENTTARGET=ctl00%24ContentPlaceHolder1%24dpListAgencies&__EVENTARGUMENT=&__LASTFOCUS=&__VIEWSTATE=%2FwEPDwULLTE1NDgwOTM3MzIPZBYCZg9kFgICAQ9kFgYCAQ9kFgQCAQ8QDxYGHg1EYXRhVGV4dEZpZWxkBQR0ZXh0Hg5EYXRhVmFsdWVGaWVsZAUFdmFsdWUeC18hRGF0YUJvdW5kZ2QQFQYNU2VsZWN0IEFnZW5jeRNBaXJwb3J0IEluZm8tQWxlcnRzGEJyaWRnZSBhbmQgVHVubmVsIEFsZXJ0cxNCdXMgVGVybWluYWwgQWxlcnRzClBBVEhBbGVydHMOUG9ydE5ZTkpBbGVydHMVBgEwA0FJUgNCVFQDQlVTBFBBVEgEUE9SVBQrAwZnZ2dnZ2cWAWZkAgMPFgIeC18hSXRlbUNvdW50Av%2F%2F%2F%2F8PZAICDw8WAh4EVGV4dAUNUmVjZW50IEFsZXJ0c2RkAgMPZBYCZg8WAh4FY2xhc3MFDW5hdjNfc2VsZWN0ZWRkZJ4grwgBKU1gC3om8YQqivjwPLecISqH2%2Bhzq295Uove&__SCROLLPOSITIONX=0&__SCROLLPOSITIONY=0&__EVENTVALIDATION=%2FwEWCAKOjr2iCAKfjMrZBAKP4%2BC3CAKQgbypCwLb049CArb66d8OAsnT%2B%2BcDAr%2BBhNkCgIqh75RPnMEqCLvf7iBkxAnm6Gwdum9rCe4qh27QKBc%3D&ctl00%24ContentPlaceHolder1%24dpListAgencies=PATH';
        request.post(
            urlToCall,{},                       
            
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    //console.log(body)

                $ = cheerio.load(body);
                var formtextLen = $('.formText').length;
                var latestStatusDate = $('.formText').eq(0).text().trim();
                var latestStatus = $('.formField').eq(1).text().trim();

                var newserviceStatus = latestStatus + '  - As of: ' + latestStatusDate;
                //var newserviceStatus = body;
                 //var newserviceStatus = $('#status-contents').text().replace(/[\n\t\r]/g,"");
                
                return callbackfunc(newserviceStatus);
                }
            }
        );
    }
    
  
    function getServiceStatus(trainlineslot, callback){

        var isMTA = true;
        var IsNJTransit = false;
        var trainline; var translatedTrainLine;
        var trainlineUnderstood = false;

        var NJTransitLinesMap = new Map();
        
        NJTransitLinesMap.set("northeast corridor", "Northeast Corridor");
        NJTransitLinesMap.set("north jersey coast", "North Jersey Coast");
        NJTransitLinesMap.set("raritan valley", "Raritan Valley");
        NJTransitLinesMap.set("morris & essex", "Morris & Essex");
        NJTransitLinesMap.set("main/bergen/port jervis", "Main/Bergen/Port Jervis");
        NJTransitLinesMap.set("montclair-boonton", "Montclair-Boonton");
        NJTransitLinesMap.set("pascack valley", "Pascack Valley");
        NJTransitLinesMap.set("atlantic city", "Atlantic City");

        NJTransitLinesMap.set("hudson-bergen light rail", "Hudson-Bergen Light Rail");
        NJTransitLinesMap.set("newark light rail", "Newark Light Rail");
        NJTransitLinesMap.set("river line", "River Line");


        if (trainlineslot.toLowerCase() == 'one' || trainlineslot.toLowerCase() == 'two' || trainlineslot.toLowerCase() == 'three' || trainlineslot.toLowerCase() == '1' || trainlineslot.toLowerCase() == '2' || trainlineslot.toLowerCase() == '3'){

            trainline = '123';
            trainlineUnderstood = true;
            translatedTrainLine =trainlineslot.toLowerCase(); 
        }   
        else if (trainlineslot.toLowerCase() == 'four' || trainlineslot.toLowerCase() == 'five' || trainlineslot.toLowerCase() == 'six' || trainlineslot.toLowerCase() == '4' || trainlineslot.toLowerCase() == '5' || trainlineslot.toLowerCase() == '6'){
            trainline = '456';
            trainlineUnderstood = true;
            translatedTrainLine = trainlineslot.toLowerCase(); 
        }   
        else if (trainlineslot.toLowerCase() == 'seven'  || trainlineslot.toLowerCase() == '7'){
            trainline = '7';
            trainlineUnderstood = true;
            translatedTrainLine = trainlineslot.toLowerCase(); 
        }
        else if (trainlineslot.toLowerCase() == 'a' || trainlineslot.toLowerCase() == 'c' ||  trainlineslot.toLowerCase() == 'e' || trainlineslot.toLowerCase() == 'a.' || trainlineslot.toLowerCase() == 'c.' ||  trainlineslot.toLowerCase() == 'e.'){
            trainline = 'ACE';
            trainlineUnderstood = true;
            if (trainlineslot.length>1){
                translatedTrainLine =trainlineslot.toLowerCase().substring(0,1); 
            }
            else
            {
                translatedTrainLine =trainlineslot.toLowerCase();
            }
        }
        else if (trainlineslot.toLowerCase() === 'b' || trainlineslot.toLowerCase() == 'd' ||  trainlineslot.toLowerCase() == 'f' || trainlineslot.toLowerCase() == 'm' ||trainlineslot.toLowerCase() === 'b.' || trainlineslot.toLowerCase() == 'd.' ||  trainlineslot.toLowerCase() == 'f.' || trainlineslot.toLowerCase() == 'm.'){
            trainline = 'BDFM';
            trainlineUnderstood = true;
            if (trainlineslot.length>1){
                translatedTrainLine =trainlineslot.toLowerCase().substring(0,1);
            }
            else
            {
                translatedTrainLine =trainlineslot.toLowerCase();
            }
        }
        else if (trainlineslot.toLowerCase() == 'n' || trainlineslot.toLowerCase() == 'q' ||  trainlineslot.toLowerCase() == 'r' || trainlineslot.toLowerCase() == 'n.' || trainlineslot.toLowerCase() == 'q.' ||  trainlineslot.toLowerCase() == 'r.' ){
            trainline = 'NQR';
            trainlineUnderstood = true;
            if (trainlineslot.length>1){
             translatedTrainLine =trainlineslot.toLowerCase().substring(0,1);
            }
            else
            {
                translatedTrainLine =trainlineslot.toLowerCase();
            }
        }
        else if (trainlineslot.toLowerCase() == 'l' || trainlineslot.toLowerCase() == 'l.'){
            trainline = 'L';
            trainlineUnderstood = true;
            if (trainlineslot.length>1){
                translatedTrainLine =trainlineslot.toLowerCase().substring(0,1);
            }
            else
            {
                translatedTrainLine =trainlineslot.toLowerCase();
            }
        }
        else if (trainlineslot.toLowerCase() == 'g' || trainlineslot.toLowerCase() == 'g.'){
            trainline = 'G';
            trainlineUnderstood = true;
            if (trainlineslot.length>1){
                translatedTrainLine =trainlineslot.toLowerCase().substring(0,1);
            }
            else
            {
                translatedTrainLine =trainlineslot.toLowerCase();
            }
        }
        else if (trainlineslot.toLowerCase() == 'j' ||  trainlineslot.toLowerCase() == 'z' ||trainlineslot.toLowerCase() == 'j.' ||  trainlineslot.toLowerCase() == 'z.' ){
            trainline = 'JZ';
            trainlineUnderstood = true;
            if (trainlineslot.length>1){
                translatedTrainLine =trainlineslot.toLowerCase().substring(0,1);
            }
            else
            {
                translatedTrainLine =trainlineslot.toLowerCase();
            }
        }
        else if (trainlineslot.toLowerCase() == 'path'){
            isMTA = false;
            trainlineUnderstood = true;
            translatedTrainLine= 'path';
        }else if (NJTransitLinesMap.has(trainlineslot.toLowerCase())){
            isMTA = false;
            IsNJTransit = true;
            trainlineUnderstood = true;

            translatedTrainLine= NJTransitLinesMap.get(trainlineslot.toLowerCase());
        }


        if (trainlineUnderstood == true && isMTA == true) {

             docallforMTA(trainline, 'http://service.mta.info/ServiceStatus/statusmessage.aspx', function(response){
                //console.log('Service Status:', response);        
                callback(response, translatedTrainLine);                
             });
         }
         else if (trainlineUnderstood == true && isMTA == false && IsNJTransit == true){
            //console.log('NJ Transit Status for:', trainlineslot + ' - ' + translatedTrainLine);  
            doCallForNJTransit(translatedTrainLine, 'http://www.njtransit.com/hp/hp_servlet.srv?hdnPageAction=HomePageTo', function(response){
                callback(response, translatedTrainLine);
            });
            
         }
         else if(trainlineUnderstood == true && isMTA == false && IsNJTransit == false){
            //console.log('Path Status for:', translatedTrainLine + ' - ' + translatedTrainLine);  
            docallforPath(trainlineslot, 'http://www.paalerts.com/recent_pathalerts.aspx', function(response){
                callback(response, translatedTrainLine);
            });
         }
    
         else
         {
            callback('');
         }
        
    }

}