/**
 * Raspi pebble app
 */
var Settings = require('settings');

var initialized = false;

var Config = require('config');
var RenderRoot = require('render-root');

Pebble.addEventListener("ready", function() {
  console.log("ready called!");
  initialized = true;
});


Pebble.addEventListener('showConfiguration', function(e) {
  Pebble.openURL('http://peterpeerdeman.nl/pebble-raspi-config.html?'+encodeURIComponent(JSON.stringify(Settings.option())));
});

Pebble.addEventListener("webviewclosed", function(e) {
  //Using primitive JSON validity and non-empty check
  if (e.response.charAt(0) == "{" && e.response.slice(-1) == "}" && e.response.length > 5) {
    Settings.option(JSON.parse(decodeURIComponent(e.response)));
    console.log("Options = " + JSON.stringify(Settings.option()));
  } else {
    console.log("Cancelled");
  }
});

//Initialize the root menu
RenderRoot(Settings.option());
