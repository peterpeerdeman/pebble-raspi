var UI = require('ui');
var raspi = require('raspi');

var RenderCar = function() {
    var carMenu = new UI.Menu({
        sections: [{
            items: [{
                title: 'charge/range'
            }]
        }]
    });

    carMenu.on('select', function(e) {
        if(e.itemIndex === 0) {
            // charge/range
            raspi.get('car/charge', function(data) {
                var resultcard = new UI.Card({
                    title: data.results[0].series[0].values[0][1] + '%, ' + data.results[0].series[0].values[0][2].toFixed(2) + 'km',
                    subtitle: new Date(data.results[0].series[0].values[0][0]).toLocaleString('nl')
                });
                resultcard.show();
            });
        }
    });
    carMenu.show();
};

module.exports = RenderCar;
