var Config = require('config');
var UI = require('ui');
var ajax = require('ajax');

var RenderRecordfairs = function() {
    ajax({
        url: Config.RECORDFAIRS_URL,
        type:'json'
    }, function(data) {
        var menuItems = data.map(function(fair) {
            return {
                title: fair.city + ' - ' + fair.location,
                subtitle: new Date(fair.startDate).toLocaleString('nl')
            };
        });
        var resultsMenu = new UI.Menu({
            sections: [{
                title: 'RecordFairs',
                items: menuItems
            }]
        });

        resultsMenu.on('select', function(e) {
            var appDetails = new UI.Card({
                title: e.item.title,
                body: e.item.subtitle,
                scrollable: true
            });

            appDetails.show();
        });

        resultsMenu.show();
    }
    );
};

module.exports = RenderRecordfairs;
