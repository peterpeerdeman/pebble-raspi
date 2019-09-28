var Config = require('config');
var UI = require('ui');
var ajax = require('ajax');
var Feature = require('platform/feature');

var RenderWork = function(Settings) {
    var lifelyMenu = new UI.Menu({
        highlightBackgroundColor: Feature.color('imperial-purple', 'black'),
        sections: [{
            items: [{
                title: 'Announcements'
            },{
                title: 'ServerStatus'
            }, {
                title: 'Team',
            }]
        }]
    });
    lifelyMenu.on('select', function(e) {
        var header = "Bearer " + Settings.worktoken;
        if(e.itemIndex === 0) {
            ajax({
                url: Config.WORK_URL,
                type:'json',
                method:'post',
                headers: {
                    'authorization': header
                },
                data: {
                    query: "query{ listAnnouncements(count:3) { date message } }",
                    variables: null
                }
            }, function(results) {
                var resultsMenu = new UI.Menu({
                    sections: [{
                        title: 'Announcements',
                        items: results.data.listAnnouncements.map(function(item) {
                            return {
                                title: new Date(item.date).toLocaleString('nl'),
                                subtitle: item.message
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
        } else if(e.itemIndex === 1) {
            ajax({
                url: Config.WORK_URL,
                type:'json',
                method:'post',
                headers: {
                    'authorization': header
                },
                data: {
                    query: "query{ listStatusCakeTests { name status uptime } }",
                    variables: null
                }
            }, function(results) {
                var resultsMenu = new UI.Menu({
                    sections: [{
                        title: 'ServerStatus',
                        items: results.data.listStatusCakeTests.map(function(item) {
                            return {
                                title: item.name,
                                subtitle: item.status + ', uptime: ' + item.uptime
                            };
                        })
                    }]
                });
                resultsMenu.show();
            });
        } else if(e.itemIndex === 2) {
            ajax({
                url: Config.WORK_URL,
                type:'json',
                method:'post',
                headers: {
                    'authorization': header
                },
                data: {
                    query: "query{ listUsers(count: 50) { data { fullName phone } } }",
                    variables: null
                }
            }, function(results) {
                var resultsMenu = new UI.Menu({
                    sections: [{
                        title: 'Team (' + results.data.listUsers.data.length +')',
                        items: results.data.listUsers.data.map(function(item) {
                            return {
                                title: item.fullName,
                                subtitle: item.phone
                            };
                        })
                    }]
                });

                resultsMenu.show();
            });
        }
    });
    lifelyMenu.show();
};

module.exports = RenderWork;
