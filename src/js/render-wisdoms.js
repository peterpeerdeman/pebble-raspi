var Config = require('config');
var UI = require('ui');
var ajax = require('ajax');

var RenderWisdoms = function() {
    ajax({
        url: Config.WISDOMS_URL,
        type:'json'
    }, function(data) {
        var resultsMenu = new UI.Menu({
            sections: [{
                title: 'Wisdoms (' + data.total_entries + ')',
                items: data.entries.map(function(wisdom) {
                    return {
                        title: wisdom.author,
                        subtitle: wisdom.quote
                    };
                })
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
    });
};

module.exports = RenderWisdoms;
