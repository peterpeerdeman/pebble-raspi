var Config = require('config');
var UI = require('ui');
var Vibe = require('ui/vibe');
var ajax = require('ajax');

var RenderMediaplayer = function() {
    var mediaplayerMenu = new UI.Menu({
        sections: [{
            items: [{
                title: 'quit'
            },{
                title: 'up'
            }, {
                title: 'down',
            }, {
                title: 'left',
            }, {
                title: 'right',
            }, {
                title: 'select',
            }, {
                title: 'pause',
            }]
        }]
    });

    mediaplayerMenu.on('select', function(e) {
        if(e.itemIndex === 0) {
            // quit
            ajax({
                url:Config.RASPAPI_URL + '/api/mediacenter/quit',
                type:'json',
                headers: {
                    'Authorization': Config.RASPAPI_AUTHHEADER
                }
            }, function(data) {
                Vibe.vibrate('short');
            });
        } else if (e.itemIndex === 1) {
            // up
            ajax({
                url:Config.RASPAPI_URL + '/api/mediacenter/up',
                type:'json',
                headers: {
                    'Authorization': Config.RASPAPI_AUTHHEADER
                }
            }, function(data) {
                Vibe.vibrate('short');
            });
        } else if (e.itemIndex === 2) {
            // down
            ajax({
                url: Config.RASPAPI_URL +'/api/mediacenter/down',
                type:'json',
                headers: {
                    'Authorization': Config.RASPAPI_AUTHHEADER
                }
            }, function(data) {
                Vibe.vibrate('short');
            });
        } else if (e.itemIndex === 3) {
            // left
            ajax({
                url:Config.RASPAPI_URL + '/api/mediacenter/left',
                type:'json',
                headers: {
                    'Authorization': Config.RASPAPI_AUTHHEADER
                }
            }, function(data) {
                Vibe.vibrate('short');
            });
        } else if (e.itemIndex === 4) {
            // right
            ajax({
                url: Config.RASPAPI_URL + '/api/mediacenter/right',
                type:'json',
                headers: {
                    'Authorization': Config.RASPAPI_AUTHHEADER
                }
            }, function(data) {
                Vibe.vibrate('short');
            });
        } else if (e.itemIndex === 5) {
            // select
            ajax({
                url: Config.RASPAPI_URL + '/api/mediacenter/select',
                type:'json',
                headers: {
                    'Authorization': Config.RASPAPI_AUTHHEADER
                }
            }, function(data) {
                Vibe.vibrate('short');
            });
        } else if (e.itemIndex === 6) {
            // pause
            ajax({
                url: Config.RASPAPI_URL + '/api/mediacenter/pause',
                type:'json',
                headers: {
                    'Authorization': Config.RASPAPI_AUTHHEADER
                }
            }, function(data) {
                Vibe.vibrate('short');
            });
        }
    });
    mediaplayerMenu.show();
};

module.exports = RenderMediaplayer;
