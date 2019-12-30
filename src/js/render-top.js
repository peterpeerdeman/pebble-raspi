var raspi = require('raspi');
var UI = require('ui');

var RenderTop = function() {
    var topMenu = new UI.Menu({
        sections: [{
            items: [{
                title: 'cpu'
            },{
                title: 'disk'
            }]
        }]
    });

    topMenu.on('select', function(e) {
        if(e.itemIndex === 0) {
            // cpu
            raspi.ajax('top/cpu', function(data) {
                var resultsMenu = new UI.Menu({
                    sections: [{
                        title: 'CPU',
                        items: data.results[0].series[0].values.map(function(item) {
                            return {
                                title: item[1] + '% cpu',
                                subtitle: new Date(item[0]).toLocaleString('nl')
                            };
                        })
                    }]
                });
                resultsMenu.show();
            });
        } else if (e.itemIndex === 1) {
            // cpu
            raspi.ajax('top/disk', function(data) {
                var resultsMenu = new UI.Menu({
                    sections: [{
                        title: 'DISK',
                        items: data.results[0].series[0].values.map(function(item) {
                            return {
                                title: (item[1]/1000/1000/1000).toFixed(2) + 'GB used',
                                subtitle: new Date(item[0]).toLocaleString('nl')
                            };
                        })
                    }]
                });
                resultsMenu.show();
            });
        }
    });
    topMenu.show();
};

module.exports = RenderTop;
