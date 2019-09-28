var Config = require('config');
var UI = require('ui');
var ajax = require('ajax');

var RenderSolar = function() {

    var parseSolarStatus = function(data) {
        var items = [{
            title: 'Power',
            subtitle: data.powerGeneration + ' W'
        }, {
            title: 'Voltage',
            subtitle: data.voltage + ' V'
        }, {
            title: 'Energy generated',
            subtitle: data.energyGeneration + ' Wh'
        }, {
            title: 'Time',
            subtitle: new Date(data.date).toLocaleString('nl')
        }];
        return items;
    };

    var parseSolarOutput = function(data) {
        var items = [];
        for(var i = 0; i < data.length; i++) {
            items.push({
                title: new Date(data[i].date).toLocaleString('nl'),
                subtitle: data[i].energyGenerated + ' Wh, ' + data[i].peakPower + ' W'
            });
        }
        return items;
    };
    var solarMenu = new UI.Menu({
        sections: [{
            items: [{
                title: 'solar status'
            },{
                title: 'solar output'
            }]
        }]
    });

    solarMenu.on('select', function(e) {
        if(e.itemIndex === 0) {
            // solar status
            ajax({
                url: Config.RASPAPI_URL + '/api/solar/status',
                type:'json',
                headers: {
                    'Authorization': Config.RASPAPI_AUTHHEADER
                }
            }, function(data) {
                var menuItems = parseSolarStatus(data);
                var resultsMenu = new UI.Menu({
                    sections: [{
                        title: 'Status',
                        items: menuItems
                    }]
                });
                resultsMenu.show();
            });
        } else if(e.itemIndex === 1) {
            // solar output
            ajax({
                url: Config.RASPAPI_URL + '/api/solar/output',
                type:'json',
                headers: {
                    'Authorization': Config.RASPAPI_AUTHHEADER
                }
            }, function(data) {
                var menuItems = parseSolarOutput(data);
                var resultsMenu = new UI.Menu({
                    sections: [{
                        title: 'Output',
                        items: menuItems
                    }]
                });
                resultsMenu.show();
            });
        }
    });
    solarMenu.show();
};

module.exports = RenderSolar;
