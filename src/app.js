/**
 * Raspi
 */

var UI = require('ui');
var Vector2 = require('vector2');
var Vibe = require('ui/vibe');
var ajax = require('ajax');

var parseLifelyFeed = function(data, quantity) {
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

var menu = new UI.Menu({
  sections: [{
    items: [{
      title: 'Lifely'
    },{
      title: 'TOP'
    }, {
      title: 'MPD',
    }, {
      title: 'Lights',
    }]
  }]
});
menu.on('select', function(e) {

  //Lifely selected
  if ( e.itemIndex === 0) {

    ajax({
      url:'http://lifely.nl/api/team.json',
      type:'json'
    },
         function(data) {
           // Create an array of Menu items
           var menuItems = parseLifelyFeed(data);

           // Construct Menu to show to user
           var resultsMenu = new UI.Menu({
             sections: [{
               title: 'Teammembers',
               items: menuItems
             }]
           });
           resultsMenu.show();
         }
        );

  } else if ( e.itemIndex === 1) {
    //TOP selected
    ajax({
      url:'http://peerdeman1.no-ip.org:3000/api/top',
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
        }]
      }]
    });
    
    mpdMenu.on('select', function(e) {
      if(e.itemIndex === 0) {
        // currentsong
        ajax({
            url:'http://peerdeman1.no-ip.org:3000/api/mpd/currentsong',
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
            url:'http://peerdeman1.no-ip.org:3000/api/mpd/play',
            method: 'POST',
            type:'json'
          },
          function(data) {
            var card = new UI.Card({
              title: 'OK'
            });
      
            card.show();
          }
        );
      } else if (e.itemIndex === 2) {
        // pause
        ajax({
            url:'http://peerdeman1.no-ip.org:3000/api/mpd/pause',
            method: 'POST',
            type:'json'
          },
          function(data) {
            var card = new UI.Card({
              title: 'OK'
            });
      
            card.show();
          }
        );
      } else if (e.itemIndex === 3) {
        // next
        ajax({
            url:'http://peerdeman1.no-ip.org:3000/api/mpd/next',
            method: 'POST',
            type:'json'
          },
          function(data) {
            var card = new UI.Card({
              title: 'OK'
            });
      
            card.show();
          }
        );
      }
    });
    mpdMenu.show();
      
  } else {
    Vibe.vibrate('short');
  }
});

menu.show();