var server = {
        numPlayers: 4,
        population: 400,
        day: 1,
        players: [],
        numFinished: 0,
        allBack: false,
        createNewPlayer: newP,
        getPopulation: getPop,
        getCatch: getCatch,
        getTotalCaught: getTotalCaught,
        startNewDay: startNewDay,
        addCatch: addCatch,
        addFinished: addFinished,
        debugEnd: debugEnd
}

function newP(){
        if (server.players.length < server.numPlayers){
                var id = server.players.length+1; // 1 <= id <= numPlayers
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
}

function getPop(){
        return server.population;
}

function getCatch(id, day){
         return server.players[id-1].catchHistory[day-1];
}

function getTotalCaught(id){
        return server.players[id-1].totalCatch;
}

function startNewDay(){
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
}
function addCatch(num){
        server.population -= num;
        
}

function addFinished(id, caught){
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
        
}

function debugEnd(){
        server.population *= 2;
        server.allBack = true;
}