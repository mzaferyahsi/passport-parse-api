var parse = require("node-parse-api").Parse;

/*
 lookup function from passport-stormpath thanks to the stormpath team for putting this together
 written by from malikov
 https://github.com/malikov/passport-parse/blob/master/lib/strategy.js
 */
function lookup(obj, field) {
    if (!obj) { return null; }

    if(typeof(obj) === 'object'){
        for(var prop in obj) {
            if(typeof(obj[prop]) === 'object'){
                return lookup(obj[prop],field);
            }
        }
    }

    var chain = field.split(']').join('').split('[');
    for (var i = 0, len = chain.length; i < len; i++) {
        var prop = obj[chain[i]];
        if (typeof(prop) === 'undefined') { return null; }
        if (typeof(prop) !== 'object') { return prop; }
        obj = prop;
    }

    return null;
}

/*
 Strategy
 */

function Strategy (opts) {
    if (!opts) {
        opts = { }
    }
    var self = this;
    var client = null;

    self._usernameField = opts.usernameField || 'username';
    self._passwordField = opts.passwordField || 'password';

    var appId = opts.app_id;
    var apiKey = opts.api_key;
    var masterKey = opts.master_key;

    if(!appId || (!apiKey && !masterKey)) {
        throw "Please provide Parse keys."
    }

    if(opts.parseClient) {
        self.client = opts.parseClient;
    } else {
        var keys = { app_id : appId };
        if(masterKey) {
            keys.master_key = masterKey;
        } else {
            keys.api_key = apiKey;
        }

        self.client = new parse(keys);
    }

    self.serializeUser = function(user, done) {
        done(user.username, user);
    };

    self.deserializeUser = function(user, done) {
        done(user.username, user);
    };

    this.name = "parse-api";

    return this;

}

Strategy.prototype.authenticate = function(req, options) {
    //
    //TODO add recursive parsing through the body data may be wrapped in an object
    //
    options = options || {};
    var self = this;

    var username = lookup(req.body, this._usernameField) || lookup(req.query, this._usernameField);
    var password = lookup(req.body, this._passwordField) || lookup(req.query, this._passwordField);
    var data = {username:username,password:password};

    if (!username || !password) {
        return self.fail({ message: options.badRequestMessage || 'Missing credentials' }, 400);
    }

    self.client.getUser(username, password, function (error, user) {
        if(error) {
            return self.fail({message: error.message, code: error.code},400);
        } else {
            return self.success(user);
        }
    });
};

module.exports = Strategy;