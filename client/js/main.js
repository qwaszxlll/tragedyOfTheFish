//Initialize Game
var height = $(window).height()-80;
var width = $(window).width();

var game = new Phaser.Game(width, height, Phaser.CANVAS, 'game');
new Phaser.Time(game);
var playerID;
var DEBUG = true;
var isMobile = false;

if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    isMobile = true;
}

game.state.add('start', start);
game.state.add('round', round);
game.state.add('waiting', waiting);
game.state.add('endOfDay', endOfDay);

Parse.initialize("MyvMz8NknuynZimWIGhicK5V731HlIKOn927xUhf", "C9BBAFEG8phjfEwbE4Rrxbii51tpHVAAstMPrvkx");

// var parseTypeGame = Parse.Object.extend("Game");
// var parseTypePlayer = Parse.Object.extend("Player");
// var gameData;
// var playerData;
// var maxPopulation;

var query = new Parse.Query(parseTypeGame);
query.get("vPLpyS0rU4", {
success: function(data) {
    
    gameData = data;
    
    if (DEBUG){
        data.set("population", 400);
        game.state.start('start');
    }
    
    maxPopulation = gameData.get("population");
    
    var playerArray = gameData.get("players");
        if (playerArray.length < gameData.get("numPlayers")){
            playerData = new parseTypePlayer();
            playerData.set("catchHistory", []);
            playerData.set("totalCatch", 0);
            playerData.set("isBack", false);

            playerData.save(null, {
                success: function(playerData) {
                    // Execute any logic that should take place after the object is saved.
                    playerID = playerData.id;
                    if (!DEBUG){
                        gameData.addUnique("players", playerID);
                        gameData.save();
                    }
                    game.state.start('start');
                },
                error: function(playerData, error) {
                    // Execute any logic that should take place if the save fails.
                    // error is a Parse.Error with an error code and message.
                    return 0;
                }
            });
        } else{
                return 0;
        }
  },
  error: function(object, error) {
    // The object was not retrieved successfully.
    // error is a Parse.Error with an error code and message.
  }
});


