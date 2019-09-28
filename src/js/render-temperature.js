var Config = require('config');
var UI = require('ui');
var ajax = require('ajax');

var RenderTemperature = function() {
    var temperatureMenu = new UI.Menu({
        sections: [{
            items: [{
                title: 'current temp outside'
            },{
                title: 'day temp outside'
            }]
        }]
    });

    temperatureMenu.on('select', function(e) {
        if(e.itemIndex === 0) {
            // currentoutside
            ajax({
                url: Config.RASPAPI_URL + '/api/weather/temperatures?location=outside&limit=1',
                type:'json',
                headers: {
                    'Authorization': Config.RASPAPI_AUTHHEADER
                }
            }, function(data) {
                var currenttemp = new UI.Card({
                    title: data[0].temperature + '° celsius',
                    subtitle: new Date(data[0].date).toLocaleString('nl')
                });

                currenttemp.show();
            }
            );
        } else if (e.itemIndex === 1) {
            // dayoutside
            ajax({
                url: Config.RASPAPI_URL + '/api/weather/temperatures?location=outside',
                type:'json',
                headers: {
                    'Authorization': Config.RASPAPI_AUTHHEADER
                }
            }, function(data) {
                var resultsMenu = new UI.Menu({
                    sections: [{
                        title: 'Outside temperatures',
                        items: data.map(function(item) {
                            return {
                                title: item.temperature + '° celsius',
                                subtitle: new Date(item.date).toLocaleString('nl')
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
