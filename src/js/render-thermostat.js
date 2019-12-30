var UI = require('ui');
var Vibe = require('ui/vibe');
var raspi = require('raspi');

var RenderTemperaturesMenu = function(e) {
    // select new temperature for zone
    var temperaturesMenu = new UI.Menu({
        sections: [{
            title: 'Temperature for zone ' + e.item.zoneName,
            items: [{
                title: '15° celcius',
                temperature: 15,
                zoneId: e.item.zoneId,
            },{
                title: '20° celcius',
                temperature: 20,
                zoneId: e.item.zoneId,
            },{
                title: '21° celcius',
                temperature: 21,
                zoneId: e.item.zoneId,
            }]
        }]
    });
    temperaturesMenu.on('select', function(e) {
        // set temp
        raspi.ajax('thermostat/zones/' + e.item.zoneId + '/overlay?temperature=' + e.item.temperature, function(data) {
            Vibe.vibrate('long');
            temperaturesMenu.hide();
        }, 'post');
    });
    temperaturesMenu.show();
};

var RenderThermostat = function() {
    raspi.ajax('thermostat/zones', function(zones) {
        var zonesMenu = new UI.Menu({
            sections: [{
                title: 'Zones',
                items: zones.map(function(zone) {
                    return {
                        title: zone.name,
                        subtitle: 'cur: ' + zone.current_temperature + ', set: ' + zone.wanted_temperature,
                        zoneId: zone.id,
                        zoneName: zone.name,
                    };
                })
            }]
        });
        zonesMenu.on('select', function(e) {
            RenderTemperaturesMenu(e);
        });
        zonesMenu.on('longSelect', function(e) {
            // disable temperature overlay
            raspi.ajax('lights/zones/' + e.item.zoneId + '/overlay', function(data) {
                Vibe.vibrate('long');
                zonesMenu.hide();
            }, 'delete');
        });
        zonesMenu.show();
    });
};

module.exports = RenderThermostat;
