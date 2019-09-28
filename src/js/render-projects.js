var UI = require('ui');
var Feature = require('platform/feature');

var RenderRecordfairs = require('render-recordfairs');
var RenderWisdoms = require('render-wisdoms');

var RenderProjects = function() {
    var projectsMenu = new UI.Menu({
        highlightBackgroundColor: Feature.color('sunset-orange', 'black'),
        sections: [{
            items: [{
                title: 'Recordfairs',
            },{
                title: 'Wisdoms',
            }]
        }]
    });
    projectsMenu.on('select', function(e) {
        if ( e.itemIndex === 0) {
            RenderRecordfairs();
        } else if ( e.itemIndex === 1) {
            RenderWisdoms();
        }
    });
    projectsMenu.show();
};

module.exports = RenderProjects;
