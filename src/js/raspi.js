var ajax = require('ajax');
var Config = require('config');
var Vibe = require('ui/vibe');

var raspi = {
    get: function(url, callback) {
        ajax({
            url: Config.RASPAPI_URL + '/api/' + url,
            type:'json',
            headers: {
                'Authorization': Config.RASPAPI_AUTHHEADER
            }
        },
        callback,
        function(error) {
            console.log(error);
            Vibe.vibrate('double');
        });
    }
};

module.exports = raspi;
