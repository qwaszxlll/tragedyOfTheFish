var server = Parse.Object.extend("Game", {

newP: function(){
        if (server.players.length < server.numPlayers){
                var Player = Parse.Object.extend("Player");
                var newPlayer = new Player();
                newPlayer.set("catchHistory", []);
                newPlayer.set("totalCatch", 0);
                newPlayer.set("isBack", false);
                var id = newPlayer.get("objectId");
                this.put()
                
                
                server.players.push({
                        id: id,
                        catchHistory: [],
                        totalCatch: 0,
                        isBack: false
                });
                console.log(server.players[id-1]);
                return id;
        } else{
                return 0;
        }
},

getPopulation: function (){
        return server.population;
},

getCatch: function (id, day){
         return server.players[id-1].catchHistory[day-1];
},

getTotalCaught: function (id){
        return server.players[id-1].totalCatch;
},

startNewDay: function (){
        if (server.allBack){
                server.numFinished = 0;
                server.allBack = false
                server.day += 1;
                for (var i=0; i<server.players.length; i++){
                        server.players[i].isBack = false;
                }
                return true;
        }
        return false;
},

addCatchfunction: function(num){
        server.population -= num;
        
},

addFinished: function (id, caught){
        if (!server.players[id-1].isBack){
                server.numFinished += 1;
                server.players[id-1].isBack = true;
                server.players[id-1].catchHistory.push(caught);
                server.players[id-1].totalCatch += caught;
                
                if (server.numFinished >= server.numPlayers){
                        server.population *= 2;
                        server.allBack = true;
                }    
        }
        
},

debugEnd: function (){
        server.population *= 2;
        server.allBack = true;
}

});