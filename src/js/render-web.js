var Config = require('config');
var Feature = require('platform/feature');
var UI = require('ui');
var ajax = require('ajax');

var renderXMLFeed = function(url) {
    ajax({
        url: url,
        type:'xml'
    }, function(data) {
        var menuItems = data.match(/<title>(.*?)<\/title>/g).map(function(title) {
            return {
                subtitle: title.substr(7, title.length-15)
            };
        });
        var resultsMenu = new UI.Menu({
            sections: [{
                items: menuItems
            }]
        });
        resultsMenu.on('select', function(e) {
            var appDetails = new UI.Card({
                body: e.item.subtitle,
                scrollable: true
            });
            appDetails.show();
        });
        resultsMenu.show();
    });
};


var RenderWeb = function() {
    var webMenu = new UI.Menu({
        highlightBackgroundColor: Feature.color('blue-moon', 'black'),
        sections: [{
            items: Config.WEB_FEEDS.map(function(item) {
                return {
                    title: item.name
                };
            })
        }]
    });

    webMenu.on('select', function(e) {
        renderXMLFeed(Config.WEB_FEEDS[e.itemIndex].url);
    });

    webMenu.show();
};

module.exports = RenderWeb;
