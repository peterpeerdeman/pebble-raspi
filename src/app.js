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
      
      // Show splash screen while waiting for data
//       var splashWindow = new UI.Window();
       
//       // Text element to inform user
//       var text = new UI.Text({
//         position: new Vector2(0, 0),
//         size: new Vector2(144, 168),
//         text:'Downloading top data...',
//         font:'GOTHIC_28_BOLD',
//         color:'black',
//         textOverflow:'wrap',
//         textAlign:'center',
//       	backgroundColor:'white'
//       });
       
//       // Add to splashWindow and show
//       splashWindow.add(text);
//       splashWindow.show();
      
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
      
    } else {
      Vibe.vibrate('short');
    }
    //console.log('Selected item #' + e.itemIndex + ' of section #' + e.sectionIndex);
    //console.log('The item is titled "' + e.item.title + '"');
  });
  menu.show();

// var main = new UI.Card({
//   title: 'Pebble.js',
//   icon: 'images/menu_icon.png',
//   subtitle: 'Hello World!',
//   body: 'Press any button.'
// });

// main.show();