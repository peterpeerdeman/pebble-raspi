var Config = require('config');
var UI = require('ui');
var ajax = require('ajax');

var RenderTop = function() {
    ajax({
        url: Config.RASPAPI_URL + '/api/top',
        type:'json',
        headers: {
            'Authorization': Config.RASPAPI_AUTHHEADER
        }
    }, function(data) {
        var resultsMenu = new UI.Menu({
            sections: [{
                title: 'Top',
                items: data.slice(0,10).map(function(item) {
                    return {
                        title: item.COMMAND,
                        subtitle: '%CPU: ' + item['%CPU'] + ' %MEM: ' + item['%MEM'],
                    };
                })
            }]
        });
        resultsMenu.show();
    });
};

module.exports = RenderTop;
