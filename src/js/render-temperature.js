var Config = require('config');
var UI = require('ui');
var ajax = require('ajax');
var raspi = require('raspi');

var RenderTemperature = function() {
    var temperatureMenu = new UI.Menu({
        sections: [{
            items: [{
                title: 'current outside'
            },{
                title: 'day outside'
            }]
        }]
    });

    temperatureMenu.on('select', function(e) {
        if(e.itemIndex === 0) {
            // currentoutside
            raspi.get('weather/measurements/last', function(data) {
                var currenttemp = new UI.Card({
                    title: data.results[0].series[0].values[0][1] + '° celsius',
                    subtitle: new Date(data.results[0].series[0].values[0][0]).toLocaleString('nl')
                });
                currenttemp.show();
            });
        } else if (e.itemIndex === 1) {
            // dayoutside
            raspi.get('weather/measurements', function(data) {
                var resultsMenu = new UI.Menu({
                    sections: [{
                        title: 'Outside temperatures',
                        items: data.results[0].series[0].values.map(function(item) {
                            return {
                                title: item[1] + '° celsius',
                                subtitle: new Date(item[0]).toLocaleString('nl')
                            };
                        })
                    }]
                });
                resultsMenu.show();
            });
        }
    });
    temperatureMenu.show();
};

module.exports = RenderTemperature;
