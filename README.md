# passport-parse-api
Parse.com Strategy for Passport.js with Parse.com API

##Usage
Clone this repo and place it under the node_modules folder of your app
	git clone https://github.com/mzaferyahsi/passport-parse-api

Include both passport and passport-parse-api

	var passport = require('passport');
	var ParseApiStrategy = require('passport-parse-api');

Let Passport Parse Api to initialize Parse Api client

    var opts = {
        app_key : "",       //Parse Application Key
        api_key : ""        //Parse Application Key
        //master_key : ""   //Parse Master Key
    }

    var parseApiStrategy = new ParseApiStrategy(opts);

Or pass Parse Api Client

    var opts = {
        parseApiClient : client //Initialize client before passing
    }

    var parseApiStrategy = new ParseApiStrategy(opts);

Then add the strategy to passport

	passport.use(parseApiStrategy);

Then add serialization of the user to passport

    passport.serializeUser(function(user, done) {
        done(null, user);
      });

    passport.deserializeUser(function(user, done) {
        done(null, user);
      });

And authenticate the user like so :

	passport.authenticate('parse-api')


