var UI = require('ui');
var Feature = require('platform/feature');

var RenderLights = require('render-lights');
var RenderThermostat = require('render-thermostat');
var RenderSolar = require('render-solar');
var RenderMusic = require('render-music');
var RenderTemperature = require('render-temperature');
var RenderTOP = require('render-top');
var RenderMediaplayer = require('render-mediaplayer');
var RenderDownloads = require('render-downloads');

var RenderHome = function() {
    var homeMenu = new UI.Menu({

        highlightBackgroundColor: Feature.color('jaeger-green', 'black'),
        sections: [{
            items: [{
                title: 'Lights',
            },{
                title: 'Thermostat',
            },{
                title: 'Solar',
            },{
                title: 'Music',
            },{
                title: 'Temperature',
            },{
                title: 'TOP'
            },{
                title: 'Mediaplayer'
            },{
                title: 'Downloads'
            }]
        }]
    });
    homeMenu.on('select', function(e) {
        if ( e.itemIndex === 0) {
            RenderLights();
        } else if ( e.itemIndex === 1) {
            RenderThermostat();
        } else if ( e.itemIndex === 2) {
            RenderSolar();
        } else if ( e.itemIndex === 3) {
            RenderMusic();
        } else if ( e.itemIndex === 4) {
            RenderTemperature();
        } else if ( e.itemIndex === 5) {
            RenderTOP();
        } else if ( e.itemIndex === 6) {
            RenderMediaplayer();
        } else if ( e.itemIndex === 7) {
            RenderDownloads();
        }
    });

    homeMenu.show();
};

module.exports = RenderHome;
