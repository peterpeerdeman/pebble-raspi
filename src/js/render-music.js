var Config = require('config');
var UI = require('ui');
var ajax = require('ajax');
var Vibe = require('ui/vibe');

var RenderMusic = function() {
    var renderMPDPlaylists = function() {
        ajax({
            url: Config.RASPAPI_URL + '/api/mpd/playlists',
            type:'json',
            headers: {
                'Authorization': Config.RASPAPI_AUTHHEADER
            }
        }, function(data) {
            var menuItems = data.map(function(playlist) {
                return {
                    title: playlist
                };
            });
            var resultsMenu = new UI.Menu({
                sections: [{
                    title: 'MPD - Playlists',
                    items: menuItems
                }]
            });

            resultsMenu.on('select', function(e) {
                ajax({
                    url: Config.RASPAPI_URL + '/api/mpd/playlists/' + encodeURIComponent(e.item.title) + '/load',
                    method: 'POST',
                    type:'json',
                    headers: {
                        'Authorization': Config.RASPAPI_AUTHHEADER
                    }
                }, function(data) {
                    Vibe.vibrate('short');
                });

            });
            resultsMenu.show();
        });
    };
    var mpdMenu = new UI.Menu({
        sections: [{
            items: [{
                title: 'currentsong'
            },{
                title: 'play'
            }, {
                title: 'pause',
            }, {
                title: 'next',
            }, {
                title: 'stop',
            }, {
                title: 'clear',
            }, {
                title: 'playlists',
            }]
        }]
    });

    mpdMenu.on('select', function(e) {
        if(e.itemIndex === 0) {
            // currentsong
            ajax({
                url: Config.RASPAPI_URL + '/api/mpd/currentsong',
                type:'json',
                headers: {
                    'Authorization': Config.RASPAPI_AUTHHEADER
                }
            }, function(data) {
                var currentsong = new UI.Card({
                    title: data.Artist + ' - ' + data.Title,
                    subtitle: data.Album
                });
                currentsong.show();
            });
        } else if (e.itemIndex === 1) {
            // play
            ajax({
                url:Config.RASPAPI_URL + '/api/mpd/play',
                method: 'POST',
                type:'json',
                headers: {
                    'Authorization': Config.RASPAPI_AUTHHEADER
                }
            }, function(data) {
                Vibe.vibrate('short');
            });
        } else if (e.itemIndex === 2) {
            // pause
            ajax({
                url: Config.RASPAPI_URL +'/api/mpd/pause',
                method: 'POST',
                type:'json',
                headers: {
                    'Authorization': Config.RASPAPI_AUTHHEADER
                }
            }, function(data) {
                Vibe.vibrate('short');
            });
        } else if (e.itemIndex === 3) {
            // next
            ajax({
                url: Config.RASPAPI_URL + '/api/mpd/next',
                method: 'POST',
                type:'json',
                headers: {
                    'Authorization': Config.RASPAPI_AUTHHEADER
                }
            }, function(data) {
                Vibe.vibrate('short');
            });
        } else if (e.itemIndex === 4) {
            // stop
            ajax({
                url: Config.RASPAPI_URL + '/api/mpd/stop',
                method: 'POST',
                type:'json',
                headers: {
                    'Authorization': Config.RASPAPI_AUTHHEADER
                }
            }, function(data) {
                Vibe.vibrate('short');
            });
        } else if (e.itemIndex === 5) {
            // stop
            ajax({
                url: Config.RASPAPI_URL + '/api/mpd/clear',
                method: 'POST',
                type:'json',
                headers: {
                    'Authorization': Config.RASPAPI_AUTHHEADER
                }
            }, function(data) {
                Vibe.vibrate('short');
            });
        } else if (e.itemIndex === 6) {
            // playlists
            renderMPDPlaylists();
        }
    });
    mpdMenu.show();
};

module.exports = RenderMusic;
