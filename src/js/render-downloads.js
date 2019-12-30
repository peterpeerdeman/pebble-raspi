var Config = require('config');
var UI = require('ui');
var ajax = require('ajax');
var Vibe = require('ui/vibe');

var RenderDownloads = function() {

    function parseTorrentItem(item) {
        return {
            title: item.name,
            subtitle: item.status + ' ' + item.rateDownload + ' kbps, ' + item.rateUpload + ' kbps'
        };
    }

    var renderAvailableDownloadsMenu = function(data) {
        var downloadItems = [];
        for(var i = 0; i < data.length; i++) {
            downloadItems.push({
                title: data[i].name,
                //subtitle: 's: ' + data[i].seeders + ' date: ' + new Date(data[i].uploadDate).toLocaleString('nl'),
                torrentLink: data[i].url
            });
        }
        var availableDownloadsMenu = new UI.Menu({
            sections: [{
                items: downloadItems
            }]
        });
        availableDownloadsMenu.on('select', function(e) {
            var appDetails = new UI.Card({
                body: e.item.title,
                scrollable: true
            });
            appDetails.show();
        });

        availableDownloadsMenu.on('longSelect', function(e) {
            var torrentLink = e.item.torrentLink;
            ajax({
                url: Config.RASPAPI_URL + '/api/downloads/getmagnet',
                type:'json',
                headers: {
                    'Authorization': Config.RASPAPI_AUTHHEADER
                },
                method: 'post',
                data: {
                    url: torrentLink
                }
            }, function (data) {
                ajax({
                    url: Config.RASPAPI_URL + '/api/downloads/add-url',
                    type:'json',
                    headers: {
                        'Authorization': Config.RASPAPI_AUTHHEADER
                    },
                    method: 'post',
                    data: {
                        url: data.magnet
                    }
                }, function (data) {
                    Vibe.vibrate('short');
                    availableDownloadsMenu.hide();
                });
            });
        });
        availableDownloadsMenu.show();
    };

    var downloadsMenu = new UI.Menu({
        sections: [{
            items: [{
                title: 'all'
            },{
                title: 'active'
            },{
                title: 'stats'
            },{
                title: 'search and add'
            }]
        }]
    });

    downloadsMenu.on('select', function(e) {
        if(e.itemIndex === 0) {
            // all
            ajax({
                url: Config.RASPAPI_URL + '/api/downloads/all',
                type:'json',
                headers: {
                    'Authorization': Config.RASPAPI_AUTHHEADER
                }
            }, function(data) {
                var resultsMenu = new UI.Menu({
                    sections: [{
                        title: 'All Torrents',
                        items: data.map(parseTorrentItem)
                    }]
                });
                resultsMenu.show();
            });
        } else if(e.itemIndex === 1) {
            // active
            ajax({
                url: Config.RASPAPI_URL + '/api/downloads/active',
                type:'json',
                headers: {
                    'Authorization': Config.RASPAPI_AUTHHEADER
                }
            }, function(data) {
                var resultsMenu = new UI.Menu({
                    sections: [{
                        title: 'Active Torrents',
                        items: data.map(parseTorrentItem)
                    }]
                });
                resultsMenu.show();
            });
        } else if (e.itemIndex === 2) {
            // stats
            ajax({
                url: Config.RASPAPI_URL + '/api/downloads/sessionstats',
                type:'json',
                headers: {
                    'Authorization': Config.RASPAPI_AUTHHEADER
                }
            }, function(data) {
                var resultsMenu = new UI.Menu({
                    sections: [{
                        title: 'Active Torrents',
                        items: [{
                            title: 'Downloadspeed',
                            subtitle: data.downloadSpeed
                        },{
                            title: 'Uploadspeed',
                            subtitle: data.uploadSpeed
                        }]
                    }]
                });
                resultsMenu.show();
            });
        } else if (e.itemIndex === 3) {
            // search and add
            ajax({
                url: Config.RASPAPI_URL + '/api/downloads/keywords',
                type:'json',
                headers: {
                    'Authorization': Config.RASPAPI_AUTHHEADER
                }
            }, function(data) {
                var keywordItems = [];
                for(var i = 0; i < data.length; i++) {
                    keywordItems.push({
                        title: data[i].name
                    });
                }
                var keywordsMenu = new UI.Menu({
                    sections: [{
                        title: 'Search Keywords',
                        items: keywordItems
                    }]
                });
                keywordsMenu.on('select', function(e) {
                    var selectedKeyword = e.item.title;

                    ajax({
                        url: Config.RASPAPI_URL + '/api/downloads/search',
                        type:'json',
                        method: 'post',
                        headers: {
                            'Authorization': Config.RASPAPI_AUTHHEADER
                        },
                        data: {
                            query: selectedKeyword
                        }
                    }, function (data) {
                        renderAvailableDownloadsMenu(data);
                    });
                });

                keywordsMenu.show();

            });
        }
    });
    downloadsMenu.show();
};

module.exports = RenderDownloads;
