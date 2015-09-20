/**
 * Raspi
 */

var UI = require('ui');
var Vibe = require('ui/vibe');
var ajax = require('ajax');
var Settings = require('settings');

var initialized = false;

var RASPAPI_URL = 'http://peerdeman1.no-ip.org:3000'

Pebble.addEventListener("ready", function() {
  console.log("ready called!");
  initialized = true;
});

var Base64 = {
    // private property
    _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    // public method for encoding
    encode : function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;
        input = Base64._utf8_encode(input);
        while (i < input.length) {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }
            output = output +
            this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
            this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
        }
        return output;
    },
    // public method for decoding
    decode : function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (i < input.length) {
            enc1 = this._keyStr.indexOf(input.charAt(i++));
            enc2 = this._keyStr.indexOf(input.charAt(i++));
            enc3 = this._keyStr.indexOf(input.charAt(i++));
            enc4 = this._keyStr.indexOf(input.charAt(i++));
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
            output = output + String.fromCharCode(chr1);
            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }
        }
        output = Base64._utf8_decode(output);
        return output;
    },
    // private method for UTF-8 encoding
    _utf8_encode : function (string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }
        return utftext;
    },
    // private method for UTF-8 decoding
    _utf8_decode : function (utftext) {
        var string = "";
        var i = 0;
        var c = 0;
//        var c1 = 0;
        var c2 = 0;
        var c3 = 0;
        while ( i < utftext.length ) {
            c = utftext.charCodeAt(i);
            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            }
            else if((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i+1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else {
                c2 = utftext.charCodeAt(i+1);
                c3 = utftext.charCodeAt(i+2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        }
        return string;
    }
};

var parseLifelyMemberFeed = function(data, quantity) {
  var items = [];
  for(var i = 0; i < data.length; i++) {
    var name = data[i].firstname;
    var title = data[i].title;
    items.push({
      title:name,
      subtitle:title
    });
  }
  return items;
};

var parseTopFeed = function(data, quantity) {
  var items = [];
  for(var i = 0; i < quantity; i++) {
    var title = data[i].COMMAND;
    var subtitle = '%CPU: ' + data[i]['%CPU'] + ' %MEM: ' + data[i]['%MEM'];
    items.push({
      title:title,
      subtitle:subtitle
    });
  }
  return items;
};

var parseTemperaturesFeed = function(data) {
  var items = [];
  for(var i = 0; i < data.length; i++) {
    items.push({
      title: data[i].temperature + '° celsius',
      subtitle: data[i].date
    });
  }
  return items;
};

var parseLifelyServerFeed = function(data) {
  var items = [];
  for(var i = 0; i < data.length; i++) {
    var title = data[i].url;
    var subtitle = data[i].statuscode + ', ' + data[i].deploydate + ', ' + data[i].version;
    items.push({
      title:title,
      subtitle:subtitle
    });
  }
  return items;
};

var parseLifelyMusicFeed = function(data) {
  var items = [];
  var tracks = data.lfm.recenttracks[0].track;
  for(var i = 0; i < tracks.length; i++) {
    var title = tracks[i].name[0];
    var subtitle = tracks[i].artist[0]._;
    items.push({
      title:title,
      subtitle:subtitle
    });
  }
  return items;
};

var renderLifelyMenu = function() {
  var lifelyMenu = new UI.Menu({
    sections: [{
      items: [{
        title: 'Servers'
      },{
        title: 'Music'
      }, {
        title: 'Team',
      }]
    }]
  });
  lifelyMenu.on('select', function(e) {
    var header = "Basic " + Base64.encode(Settings.option('username') + ":" + Settings.option('password'));
    if(e.itemIndex === 0) {
      ajax({
        url:'http://dashboard.lifely.nl/api/serverstatus',
        type:'json',
        headers: {
          'Authorization': header
        }
      },
      function(data) {
        var menuItems = parseLifelyServerFeed(data);
        var resultsMenu = new UI.Menu({
          sections: [{
            title: 'Servers',
            items: menuItems
          }]
        });
        resultsMenu.show();
      });
    } else if(e.itemIndex === 1) {
      ajax({
        url:'http://dashboard.lifely.nl/api/music?limit=5',
        type:'json',
        headers: {
          'Authorization': header
        }
      },
      function(data) {
        var menuItems = parseLifelyMusicFeed(data);
        var resultsMenu = new UI.Menu({
          sections: [{
            title: 'Music',
            items: menuItems
          }]
        });
        resultsMenu.show();
      });
    }
    if(e.itemIndex === 2) {
      ajax({
        url:'http://lifely.nl/api/team.json',
        type:'json'
      },
      function(data) {
      var menuItems = parseLifelyMemberFeed(data);
        var resultsMenu = new UI.Menu({
          sections: [{
            title: 'Teammembers',
            items: menuItems
          }]
        });
        resultsMenu.show();
      }
      );
    }
  });
  lifelyMenu.show();
};

var renderMPDMenu = function() {
  var mpdMenu = new UI.Menu({
    sections: [{
      items: [{
        title: 'currentsong'
      },{
        title: 'play'
      }, {
        title: 'pause',
      }, {
        title: 'next',
      }, {
        title: 'stop',
      }]
    }]
  });

  mpdMenu.on('select', function(e) {
    if(e.itemIndex === 0) {
      // currentsong
      ajax({
        url:RASPAPI_URL + '/api/mpd/currentsong',
        type:'json'
      },
           function(data) {
             var currentsong = new UI.Card({
               title: data.Artist + ' - ' + data.Title,
               subtitle: data.Album
             });

             currentsong.show();
           }
          );
    } else if (e.itemIndex === 1) {
      // play
      ajax({
        url:RASPAPI_URL + '/api/mpd/play',
        method: 'POST',
        type:'json'
      },
           function(data) {
             Vibe.vibrate('long');
           }
          );
    } else if (e.itemIndex === 2) {
      // pause
      ajax({
        url: RASPAPI_URL +'/api/mpd/pause',
        method: 'POST',
        type:'json'
      },
           function(data) {
             Vibe.vibrate('long');
           }
          );
    } else if (e.itemIndex === 3) {
      // next
      ajax({
        url:RASPAPI_URL + '/api/mpd/next',
        method: 'POST',
        type:'json'
      },
           function(data) {
             Vibe.vibrate('long');
           }
          );
    } else if (e.itemIndex === 4) {
      // stop
      ajax({
        url: RASPAPI_URL + '/api/mpd/stop',
        method: 'POST',
        type:'json'
      },
           function(data) {
             Vibe.vibrate('long');
           }
          );
    }
  });
  mpdMenu.show();
};

var renderHomeMenu = function() {
  var homeMenu = new UI.Menu({
    sections: [{
      items: [{
        title: 'current temp'
      },{
        title: 'day temp'
      }]
    }]
  });

  homeMenu.on('select', function(e) {
    if(e.itemIndex === 0) {
      // current
      ajax({
        url: RASPAPI_URL + '/api/weather/temperatures?limit=1',
        type:'json'
      },
           function(data) {
             console.log('data',data);
             var currenttemp = new UI.Card({
               title: data[0].temperature + '° celsius',
               subtitle: data[0].date
             });

             currenttemp.show();
           }
          );
    } else if (e.itemIndex === 1) {
      // daytemp
      ajax({
        url: RASPAPI_URL + '/api/weather/temperatures',
        type:'json'
      },
       function(data) {
         var menuItems = parseTemperaturesFeed(data);
         var resultsMenu = new UI.Menu({
           sections: [{
             title: 'Day temperatures',
             items: menuItems
           }]
         });
         resultsMenu.show();
       });
    } 
  });
  homeMenu.show();
};

var menu = new UI.Menu({
  sections: [{
    items: [{
      title: 'Lifely'
    },{
      title: 'TOP'
    }, {
      title: 'MPD',
    }, {
      title: 'Home',
    }
    ]
  }]
});
menu.on('select', function(e) {

  //Lifely selected
  if ( e.itemIndex === 0) {
    
    renderLifelyMenu();

  } else if ( e.itemIndex === 1) {
    //TOP selected
    ajax({
      url: RASPAPI_URL + '/api/top',
      type:'json'
    },
         function(data) {
           var menuItems = parseTopFeed(data, 10);
           var resultsMenu = new UI.Menu({
             sections: [{
               title: 'Top',
               items: menuItems
             }]
           });
           resultsMenu.show();
         }
        );
  } else if ( e.itemIndex === 2) {
    // mpd selected
    renderMPDMenu();
      
  }  else if ( e.itemIndex === 3) {
    // home selected
    renderHomeMenu();
      
  } else {
    Vibe.vibrate('short');
  }
});

menu.show();

Pebble.addEventListener('showConfiguration', function(e) {
  // Show config page
  Pebble.openURL('http://peterpeerdeman.nl/pebble-raspi-config.html?'+encodeURIComponent(JSON.stringify(Settings.option())));
});

Pebble.addEventListener("webviewclosed", function(e) {
  console.log("configuration closed");
  // webview closed
  //Using primitive JSON validity and non-empty check
  if (e.response.charAt(0) == "{" && e.response.slice(-1) == "}" && e.response.length > 5) {
    Settings.option(JSON.parse(decodeURIComponent(e.response)));
    console.log("Options = " + JSON.stringify(Settings.option()));
  } else {
    console.log("Cancelled");
  }
});