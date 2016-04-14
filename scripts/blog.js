// Description:
//   Retrieves the Latest Specified Blog Title and URL
//
// Dependencies:
//   None
//
// Configuration:
//   None
//
// Commands:
//   hubot blog - gets the latest specified blog post

var feed = require("feed-read");
var appConfig = require('../config');

module.exports = function(robot) {
    robot.respond(/(blog)/i, function(msg){
	        
	        var url = appConfig.blogPostRSSURL;

	  		getLatestPost(url, function(blogTitle) {
	        if(typeof blogTitle === 'undefined') {
	          msg.reply('Sorry, No Blog can be found. Try again at a later time...');
	        } else {
	          var blogText = blogTitle;

	          msg.reply(blogText);
	        }
	      });
	  	});

     function getLatestPost (urlToCall, callback){

	     feed(urlToCall,
		      function(err, articles) {
		        
		        var blogTitle = '';
		        var blogLink = '';
		        if (err){
					blogTitle = 'Error Fetching Blog Post';        	

		        }
		        else{

		        	blogTitle = articles[0].title  + ' - ' + articles[0].link;        	
		    	}	


		        callback(blogTitle);
		      }
		    );
	 	}
}
		      
	   
	