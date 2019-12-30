var Config = require('config');
var UI = require('ui');
var Vibe = require('ui/vibe');
var raspi = require('raspi');

var RenderLegacy = function() {
    var legacyMenu = new UI.Menu({
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

    legacyMenu.on('select', function(e) {
        if(e.itemIndex === 0) {
            // lights status
            raspi.ajax('lights/lights', function(data) {
                var resultsMenu = new UI.Menu({
                    sections: [{
                        title: 'Lights',
                        items: data.lights.map(function(item) {
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
            raspi.ajax('lights/on', function(data) {
                Vibe.vibrate('short');
            });
        } else if (e.itemIndex === 2) {
            // lights off
            raspi.ajax('lights/off', function(data) {
                Vibe.vibrate('short');
            });
        } else if (e.itemIndex === 3) {
            // lights off
            raspi.ajax('lights/randomcolor', function(data) {
                Vibe.vibrate('short');
            });
        } else if (e.itemIndex === 4) {
            raspi.ajax('lights/randomcolors', function(data) {
                Vibe.vibrate('short');
            });
        } else if (e.itemIndex === 5) {
            raspi.ajax('lights/colorloop', function(data) {
                Vibe.vibrate('short');
            });
        } else if (e.itemIndex === 6) {
            raspi.ajax('lights/brightness/inc', function(data) {
                Vibe.vibrate('short');
            });
        } else if (e.itemIndex === 7) {
            raspi.ajax('lights/brightness/dec', function(data) {
                Vibe.vibrate('short');
            });
        } else if (e.itemIndex === 8) {
            raspi.ajax('lights/scenes', function(data) {
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
                    raspi.ajax('lights/scenes/' + encodeURIComponent(e.item.id) + '/activate', function(data) {
                        Vibe.vibrate('short');
                    });
                });
                resultsMenu.show();
            });
        }
    });
    legacyMenu.show();
};

var RenderGroups = function(groups) {
    raspi.ajax('lights/groups', function(groups) {
        var groupsMenu = new UI.Menu({
            sections: [{
                title: 'Rooms',
                items: groups.map(function(group) {
                    return {
                        title: group._rawData.name,
                        subtitle: 'all: ' + group._rawData.state.all_on + ', any: ' + group._rawData.state.any_on,
                        _id: group._id,
                    };
                })
            }]
        });
        groupsMenu.on('select', function(e) {
            // enable group
            raspi.ajax('lights/groups/' + e.item._id + '/on', function(data) {
                Vibe.vibrate('short');
                groupsMenu.hide();
            });
        });

        groupsMenu.on('longSelect', function(e) {
            // disable group
            raspi.ajax('lights/groups/' + e.item._id + '/off', function(data) {
                Vibe.vibrate('long');
                groupsMenu.hide();
            });
        });
        groupsMenu.show();
    });
};

var RenderLights = function() {

    var lightsMenu = new UI.Menu({
        sections: [{
            items: [{
                title: 'rooms'
            },{
                title: 'legacy'
            }]
        }]
    });

    lightsMenu.on('select', function(e) {
        if(e.itemIndex === 0) {
            // groups
            RenderGroups();
        } else if(e.itemIndex === 1) {
            // legacy
            RenderLegacy();
        }
    });
    lightsMenu.show();

};

module.exports = RenderLights;
