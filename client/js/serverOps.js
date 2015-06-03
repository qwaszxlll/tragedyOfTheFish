var serverOps = {

getDay: function (){
     return gameData.get("day");   
},

newP: function(gameData, playerData){
        var playerArray = gameData.get("players");
        if (playerArray.length < gameData.get("numPlayers")){
                playerData = new parseTypePlayer();
                playerData.set("catchHistory", []);
                playerData.set("totalCatch", 0);
                playerData.set("isBack", false);
                playerData.save();
                
                var id;
                playerData.save(null, {
                        success: function(playerData) {
                                // Execute any logic that should take place after the object is saved.
                                id = playerData.id;
                                gameData.addUnique("players", id);
                                gameData.save();
                                return id;
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

getPopulation: function (){
        return gameData.get("population");
},

getCatch: function (id, day){
        var query = new Parse.Query(parseTypePlayer);
        query.get(id, {
                success: function(player) {
                        return player.get("catchHistory")[day-1];
                },
                error: function(object, error) {
                        
                }
        });
},

getTotalCaught: function (id){
        var query = new Parse.Query(parseTypePlayer);
        query.get(id, {
                success: function(player) {
                        return player.get("totalCatch");
                },
                error: function(object, error) {
                        
                }
        });
},

startNewDay: function (){
        if (gameData.get("allBack")){
                gameData.set("numFinished", 0);
                gameData.set("allBack", false);
                gameData.increment("day");
                var players = gameData.get("players");
                for (var i=0; i<players.length; i++){
                        var id = players[i];
                        var query = new Parse.Query(parseTypePlayer);
                        query.get(id, {
                                success: function(player) {
                                        return player.set("isBack", false);
                                },
                                error: function(object, error) {
                                        
                                }
                        });
                }
                return true;
        }
        return false;
},

addCatch: function(gameData, num){
        gameData.increment("population", -num);
},

addFinished: function (caught){
        if (!playerData.get("isBack") || DEBUG){
                gameData.increment("numFinished");
                playerData.set("isBack", true);
                playerData.add("catchHistory", caught);
                playerData.increment("totalCatch", caught);
                playerData.save();
                
                gameData.save().then(function (gameData){
                        if (gameData.get("numFinished") >= gameData.get("numPlayers")){
                                var pop = Math.min(gameData.get("population")*2, maxPopulation);
                                gameData.set("population", pop);
                        }
                });
        }
        
},

debugEnd: function (){
        var pop = Math.min(gameData.get("population")*2, maxPopulation);
        gameData.set("population", pop);
        gameData.set("allBack", true);
}

};