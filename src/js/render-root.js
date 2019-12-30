var UI = require('ui');

var RenderHome = require('render-home');
var RenderWork = require('render-work');
var RenderCar = require('render-car');
var RenderProjects = require('render-projects');
var RenderWeb = require('render-web');

var RenderRoot = function(Settings) {

    var mainMenu = new UI.Menu({
        sections: [{
            items: [{
                title: 'Home'
            },{
                title: 'Work'
            },{
                title: 'Car'
            },{
                title: 'Projects'
            },{
                title: 'Web',
            }]
        }]
    });

    mainMenu.on('select', function(e) {
        //Lifely selected
        if ( e.itemIndex === 0) {
            RenderHome();
        } else if ( e.itemIndex === 1) {
            RenderWork(Settings);
        } else if ( e.itemIndex === 2) {
            RenderCar();
        } else if ( e.itemIndex === 3) {
            RenderProjects();
        } else if ( e.itemIndex === 4) {
            RenderWeb();
        }
    });

    mainMenu.show();
};

module.exports = RenderRoot;
