//Initialize Game
var height = 600 //$(window).height();
var width = 900 //$(window).width();

var game = new Phaser.Game(width, height, Phaser.CANVAS, 'game');
new Phaser.Time(game);
var playerID = server.createNewPlayer();

Parse.initialize("MyvMz8NknuynZimWIGhicK5V731HlIKOn927xUhf", "C9BBAFEG8phjfEwbE4Rrxbii51tpHVAAstMPrvkx");

var gameServer = new Parse.Object.extent("Game");
var query = new Parse.query(gameServer);
query.get("vPLpyS0rU4", {
success: function(gameServer) {
    // The object was retrieved successfully.
  },
  error: function(object, error) {
    // The object was not retrieved successfully.
    // error is a Parse.Error with an error code and message.
  }
});


// gameScore.set("score", 1337);
// gameScore.set("playerName", "Sean Plott");
// gameScore.set("cheatMode", false);

// gameScore.save(null, {
//   success: function(gameScore) {
//     // Execute any logic that should take place after the object is saved.
//     alert('New object created with objectId: ' + gameScore.id);
//   },
//   error: function(gameScore, error) {
//     // Execute any logic that should take place if the save fails.
//     // error is a Parse.Error with an error code and message.
//     alert('Failed to create new object, with error code: ' + error.message);
//   }
// });