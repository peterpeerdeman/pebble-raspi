var Config = require('config');
var UI = require('ui');
var Vibe = require('ui/vibe');
var ajax = require('ajax');

var RenderLights = function() {

    var lightsMenu = new UI.Menu({
        sections: [{
            items: [{
                title: 'lights'
            },{
                title: 'lights on'
            },{
                title: 'lights off'
            },{
                title: 'randomcolor'
            },{
                title: 'randomcolors'
            },{
                title: 'lights colorloop'
            },{
                title: 'lights bri inc'
            },{
                title: 'lights bri dec'
            },{
                title: 'scenes'
            }]
        }]
    });

    lightsMenu.on('select', function(e) {
        if(e.itemIndex === 0) {
            // lights status
            ajax({
                url: Config.RASPAPI_URL + '/api/lights/lights/details',
                type:'json',
                headers: {
                    'Authorization': Config.RASPAPI_AUTHHEADER
                }
            }, function(data) {
                var resultsMenu = new UI.Menu({
                    sections: [{
                        title: 'Lights',
                        items: data.map(function(item) {
                            return {
                                title: item.name,
                                subtitle: 'on: ' + item.state.on + ', bri: ' + item.state.bri,
                            };
                        })
                    }]
                });
                resultsMenu.show();
            });
        } else if(e.itemIndex === 1) {
            // lights on
            ajax({
                url: Config.RASPAPI_URL + '/api/lights/on',
                type:'json',
                headers: {
                    'Authorization': Config.RASPAPI_AUTHHEADER
                }
            },
                function(data) {
                    Vibe.vibrate('short');
                });
        } else if (e.itemIndex === 2) {
            // lights off
            ajax({
                url: Config.RASPAPI_URL + '/api/lights/off',
                type:'json',
                headers: {
                    'Authorization': Config.RASPAPI_AUTHHEADER
                }
            },
                function(data) {
                    Vibe.vibrate('short');
                });
        } else if (e.itemIndex === 3) {
            // lights off
            ajax({
                url: Config.RASPAPI_URL + '/api/lights/randomcolor',
                type:'json',
                headers: {
                    'Authorization': Config.RASPAPI_AUTHHEADER
                }
            },
                function(data) {
                    Vibe.vibrate('short');
                });
        } else if (e.itemIndex === 4) {
            ajax({
                url: Config.RASPAPI_URL + '/api/lights/randomcolors',
                type:'json',
                headers: {
                    'Authorization': Config.RASPAPI_AUTHHEADER
                }
            },
                function(data) {
                    Vibe.vibrate('short');
                });
        } else if (e.itemIndex === 5) {
            ajax({
                url: Config.RASPAPI_URL + '/api/lights/colorloop',
                type:'json',
                headers: {
                    'Authorization': Config.RASPAPI_AUTHHEADER
                }
            },
                function(data) {
                    Vibe.vibrate('short');
                });
        } else if (e.itemIndex === 6) {
            ajax({
                url: Config.RASPAPI_URL + '/api/lights/brightness/inc',
                type:'json',
                headers: {
                    'Authorization': Config.RASPAPI_AUTHHEADER
                }
            },
                function(data) {
                    Vibe.vibrate('short');
                });
        } else if (e.itemIndex === 7) {
            ajax({
                url: Config.RASPAPI_URL + '/api/lights/brightness/dec',
                type:'json',
                headers: {
                    'Authorization': Config.RASPAPI_AUTHHEADER
                }
            },
                function(data) {
                    Vibe.vibrate('short');
                });
        } else if (e.itemIndex === 8) {
            // scenes
            ajax({
                url: Config.RASPAPI_URL + '/api/lights/scenes',
                type:'json',
                headers: {
                    'Authorization': Config.RASPAPI_AUTHHEADER
                }
            },
                function(data) {
                    var resultsMenu = new UI.Menu({
                        sections: [{
                            title: 'Scenes',
                            items: data.map(function(item) {
                                return {
                                    title: item.name,
                                    subtitle: new Date(item.lastupdated).toLocaleString('nl'),
                                };
                            })
                        }]
                    });
                    resultsMenu.on('select', function(e) {
                        ajax({
                            url:Config.RASPAPI_URL + '/api/lights/scenes/' + encodeURIComponent(e.item.id) + '/activate',
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
        }
    });
    lightsMenu.show();

};

module.exports = RenderLights;
