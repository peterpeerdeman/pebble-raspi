/**
 * Raspi
 */

var UI = require('ui');
var Vibe = require('ui/vibe');
var ajax = require('ajax');
var Settings = require('settings');
var Base64 = require('base64');
var Feature = require('platform/feature');

var initialized = false;

var RASPAPI_URL = '';
var REALROYALTYFREE_URL = '';

Pebble.addEventListener("ready", function() {
  console.log("ready called!");
  initialized = true;
});

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
  for(var i = data.length - 1; i >= 0; i--) {
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

var parseLightsFeed = function(data) {
  var items = [];
  for(var i = 0; i < data.length; i++) {
    items.push({
      title: data[i].name,
      subtitle: 'on: ' + data[i].state.on + ', bri: ' + data[i].state.bri
    });
  }
  return items;
};

var renderLifelyMenu = function() {
  var lifelyMenu = new UI.Menu({
    highlightBackgroundColor: Feature.color('imperial-purple', 'black'),
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
      }, function(data) {
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

var renderMPDPlaylists = function() {
  ajax({
      url: RASPAPI_URL + '/api/mpd/playlists',
      type:'json'
  }, function(data) {
    var menuItems = data.map(function(playlist) {
      return {
        title: playlist
      };
    });
    var resultsMenu = new UI.Menu({
      sections: [{
        title: 'MPD - Playlists',
        items: menuItems
      }]
    });

    resultsMenu.on('select', function(e) {
      ajax({
        url:RASPAPI_URL + '/api/mpd/playlists/' + encodeURIComponent(e.item.title) + '/load',
        method: 'POST',
        type:'json'
      }, function(data) {
        Vibe.vibrate('short');
      });

    });
    resultsMenu.show();
  });
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
      }, {
        title: 'clear',
      }, {
        title: 'playlists',
      }]
    }]
  });

  mpdMenu.on('select', function(e) {
    if(e.itemIndex === 0) {
      // currentsong
      ajax({
        url:RASPAPI_URL + '/api/mpd/currentsong',
        type:'json'
      }, function(data) {
        var currentsong = new UI.Card({
          title: data.Artist + ' - ' + data.Title,
          subtitle: data.Album
        });
        currentsong.show();
      });
    } else if (e.itemIndex === 1) {
      // play
      ajax({
        url:RASPAPI_URL + '/api/mpd/play',
        method: 'POST',
        type:'json'
      }, function(data) {
        Vibe.vibrate('short');
      });
    } else if (e.itemIndex === 2) {
      // pause
      ajax({
        url: RASPAPI_URL +'/api/mpd/pause',
        method: 'POST',
        type:'json'
      }, function(data) {
        Vibe.vibrate('short');
      });
    } else if (e.itemIndex === 3) {
      // next
      ajax({
        url:RASPAPI_URL + '/api/mpd/next',
        method: 'POST',
        type:'json'
      }, function(data) {
        Vibe.vibrate('short');
      });
    } else if (e.itemIndex === 4) {
      // stop
      ajax({
        url: RASPAPI_URL + '/api/mpd/stop',
        method: 'POST',
        type:'json'
      }, function(data) {
             Vibe.vibrate('short');
      });
    } else if (e.itemIndex === 5) {
      // stop
      ajax({
        url: RASPAPI_URL + '/api/mpd/clear',
        method: 'POST',
        type:'json'
      }, function(data) {
             Vibe.vibrate('short');
      });
    } else if (e.itemIndex === 6) {
      // playlists
      renderMPDPlaylists();
    }
  });
  mpdMenu.show();
};

var renderTemperatureMenu = function() {
  var temperatureMenu = new UI.Menu({
    sections: [{
      items: [{
        title: 'current temp inside'
      },{
        title: 'day temp inside'
      },{
        title: 'current temp outside'
      },{
        title: 'day temp outside'
      }]
    }]
  });

  temperatureMenu.on('select', function(e) {
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
             title: 'Inside temperatures',
             items: menuItems
           }]
         });
         resultsMenu.show();
       });
    } else if(e.itemIndex === 2) {
      // current
      ajax({
        url: RASPAPI_URL + '/api/weather/temperatures?location=outside&limit=1',
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
    } else if (e.itemIndex === 3) {
      // daytemp
      ajax({
        url: RASPAPI_URL + '/api/weather/temperatures?location=outside',
        type:'json'
      },
       function(data) {
         var menuItems = parseTemperaturesFeed(data);
         var resultsMenu = new UI.Menu({
           sections: [{
             title: 'Outside temperatures',
             items: menuItems
           }]
         });
         resultsMenu.show();
       });
    } 
  });
  temperatureMenu.show();
};

var renderLightsMenu = function() {
  var lightsMenu = new UI.Menu({
    sections: [{
      items: [{
        title: 'lights status'
      },{
        title: 'lights on'
      },{
        title: 'lights off'
      },{
        title: 'randomcolor'
      },{
        title: 'randomcolors'
      },{
        title: 'lights colorloop'
      },{
        title: 'lights bri inc'
      },{
        title: 'lights bri dec'
      }]
    }]
  });

  lightsMenu.on('select', function(e) {
    if(e.itemIndex === 0) {
      // lights status
      ajax({
        url: RASPAPI_URL + '/api/lights/lights/details',
        type:'json'
      }, function(data) {
         var menuItems = parseLightsFeed(data);
         var resultsMenu = new UI.Menu({
           sections: [{
             title: 'Lights',
             items: menuItems
           }]
         });
         resultsMenu.show();
       });
    } else if(e.itemIndex === 1) {
      // lights on
      ajax({
        url: RASPAPI_URL + '/api/lights/on',
        type:'json'
      },
      function(data) {
         Vibe.vibrate('short');
      });
    } else if (e.itemIndex === 2) {
      // lights off
      ajax({
        url: RASPAPI_URL + '/api/lights/off',
        type:'json'
      },
      function(data) {
         Vibe.vibrate('short');
      });
    } else if (e.itemIndex === 3) {
      // lights off
      ajax({
        url: RASPAPI_URL + '/api/lights/randomcolor',
        type:'json'
      },
      function(data) {
         Vibe.vibrate('short');
      });
    } else if (e.itemIndex === 4) {
      ajax({
        url: RASPAPI_URL + '/api/lights/randomcolors',
        type:'json'
      },
      function(data) {
         Vibe.vibrate('short');
      });
    } else if (e.itemIndex === 5) {
      ajax({
        url: RASPAPI_URL + '/api/lights/colorloop',
        type:'json'
      },
      function(data) {
         Vibe.vibrate('short');
      });
    } else if (e.itemIndex === 6) {
      ajax({
        url: RASPAPI_URL + '/api/lights/brightness/inc',
        type:'json'
      },
      function(data) {
         Vibe.vibrate('short');
      });
    } else if (e.itemIndex === 7) {
      ajax({
        url: RASPAPI_URL + '/api/lights/brightness/dec',
        type:'json'
      },
      function(data) {
         Vibe.vibrate('short');
      });
    }
  });
  lightsMenu.show();
};

var parseSolarStatus = function(data) {
  var items = [{
    title: 'Power',
    subtitle: data.powerGeneration + ' W'
  }, {
    title: 'Voltage',
    subtitle: data.voltage + ' V'
  }, {
    title: 'Energy generated',
    subtitle: data.energyGeneration + ' Wh'
  }, {
    title: 'Time',
    subtitle: data.time + ' ' + data.date
  }];
  return items;
};

var parseSolarOutput = function(data) {
  var items = [];
  for(var i = 0; i < data.length; i++) {
    items.push({
      title: data[i].date,
      subtitle: data[i].energyGenerated + ' Wh, ' + data[i].peakPower + ' W'
    });
  }
  return items;
};

var renderTOP = function() {
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
};

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

var renderWebMenu = function() {
  var webMenu = new UI.Menu({
    highlightBackgroundColor: Feature.color('blue-moon', 'black'),
    sections: [{
      items: [{
        title: 'nu'
      },{
        title: 'verge'
      },{
        title: 'pitchfork'
      }]
    }]
  });

  webMenu.on('select', function(e) {
    if(e.itemIndex === 0) {
      // nu
      renderXMLFeed('http://www.nu.nl/rss');
    } else if(e.itemIndex === 1) {
      // verge
      renderXMLFeed('http://www.theverge.com/rss/index.xml');
    } else if(e.itemIndex === 2) {
      renderXMLFeed('http://pitchfork.com/rss/reviews/albums/');
    }
  });
  webMenu.show();
};

var renderSolarMenu = function() {
  var solarMenu = new UI.Menu({
    sections: [{
      items: [{
        title: 'solar status'
      },{
        title: 'solar output'
      }]
    }]
  });

  solarMenu.on('select', function(e) {
    if(e.itemIndex === 0) {
      // solar status
      ajax({
        url: RASPAPI_URL + '/api/solar/status',
        type:'json'
      }, function(data) {
         var menuItems = parseSolarStatus(data);
         var resultsMenu = new UI.Menu({
           sections: [{
             title: 'Status',
             items: menuItems
           }]
         });
         resultsMenu.show();
       });
    } else if(e.itemIndex === 1) {
      // solar output
      ajax({
        url: RASPAPI_URL + '/api/solar/output',
        type:'json'
      }, function(data) {
         var menuItems = parseSolarOutput(data);
         var resultsMenu = new UI.Menu({
           sections: [{
             title: 'Output',
             items: menuItems
           }]
         });
         resultsMenu.show();
       });  
    }
  });
  solarMenu.show();
};

var renderHomeMenu = function() {
    var homeMenu = new UI.Menu({
      
      highlightBackgroundColor: Feature.color('jaeger-green', 'black'),
      sections: [{
        items: [{
          title: 'Lights',
        },{
          title: 'Solar',
        },{
          title: 'Music',
        },{
          title: 'Temperature',
        },{
          title: 'TOP'
        }]
      }]
  });
  homeMenu.on('select', function(e) {
    if ( e.itemIndex === 0) {
      renderLightsMenu();
    } else if ( e.itemIndex === 1) {
      renderSolarMenu();
    } else if ( e.itemIndex === 2) {
      renderMPDMenu();
    } else if ( e.itemIndex === 3) {
      renderTemperatureMenu();
    } else if ( e.itemIndex === 4) {
      renderTOP();   
    }
  });
  
  homeMenu.show();
};

var parseRRFFeed = function(data) {
  var items = [];
  console.log(data.counts);
  for (var property in data.counts) {
    items.push({
      title: property,
      subtitle: data.counts[property]
    });
  }
  
  // separator
  items.push({
      title: '--------'
  });
  
  data.medias.forEach(function(media) {
    items.push({
      title: media.title,
      subtitle: media.preview_count
    });
  });
  return items;
};

var renderRealRoyaltyFree = function() {
  ajax({
      url: REALROYALTYFREE_URL,
      type:'json'
    },
       function(data) {
         var menuItems = parseRRFFeed(data);
         var resultsMenu = new UI.Menu({
           sections: [{
             title: 'RealRoyaltyFree',
             items: menuItems
           }]
         });
         resultsMenu.show();
       }
      );
};

var renderRecordfairs = function() {
  ajax({
      url: 'http://recordfairs.nl/fairs?limit=10',
      type:'json'
    },
       function(data) {
         var menuItems = data.map(function(fair) {
           return {
             title: fair.city + ' - ' + fair.location,
             subtitle: fair.startDate
           };
         });
         var resultsMenu = new UI.Menu({
           sections: [{
             title: 'RealRoyaltyFree',
             items: menuItems
           }]
         });
         
         resultsMenu.on('select', function(e) {
            var appDetails = new UI.Card({
              title: e.item.title,
              body: e.item.subtitle + '\n' + e.item.body,
              scrollable: true
            });
            
            appDetails.show();
          });
         
         resultsMenu.show();
       }
      );
};

var renderWisdoms = function() {
  ajax({
      url: 'http://wisdoms.nl/wisdoms.json',
      type:'json'
    },
       function(data) {
         var menuItems = data.entries.map(function(wisdom) {
           return {
             title: wisdom.author,
             subtitle: wisdom.quote
           };
         });
         
         menuItems.unshift({
           title: 'total wisdoms',
           subtitle: data.total_entries
         });
         
         var resultsMenu = new UI.Menu({
           sections: [{
             title: 'RealRoyaltyFree',
             items: menuItems
           }]
         });
         
         resultsMenu.on('select', function(e) {
            var appDetails = new UI.Card({
              title: e.item.title,
              body: e.item.subtitle + '\n' + e.item.body,
              scrollable: true
            });
            
            appDetails.show();
          });
         
         resultsMenu.show();
       }
      );
};

var renderProjectsMenu = function() {
    var projectsMenu = new UI.Menu({
      highlightBackgroundColor: Feature.color('sunset-orange', 'black'),
      sections: [{
        items: [{
          title: 'RealRoyaltyFree',
        },{
          title: 'Recordfairs',
        },{
          title: 'Wisdoms',
        }]
      }]
    });
    projectsMenu.on('select', function(e) {
      if ( e.itemIndex === 0) {
        renderRealRoyaltyFree();
      } else if ( e.itemIndex === 1) {
        renderRecordfairs();
      } else if ( e.itemIndex === 2) {
        renderWisdoms();
      }
    });
    
    projectsMenu.show();
};

var mainMenu = new UI.Menu({
  sections: [{
    items: [{
      title: 'Home'
    },{
      title: 'Work'
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
    renderHomeMenu();
  } else if ( e.itemIndex === 1) {
    renderLifelyMenu();
  } else if ( e.itemIndex === 2) {
    renderProjectsMenu();
  } else if ( e.itemIndex === 3) {
    renderWebMenu();
  }
});

mainMenu.show();

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
